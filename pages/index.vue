<template>
  <b-container class="mt-3">
    <b-row>
      <component v-for="device in devices" :key="device.deviceid" v-if="isComponentForDeviceType(device.type)"
                 :is="deviceTypeToComponentName(device.type)" :device="device" />
    </b-row>
  </b-container>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import SocketIO from 'socket.io-client'
  import WidgetSwitch from '~/components/widgets/Switch.vue'
  import WidgetShutter from '~/components/widgets/Shutter.vue'
  import WidgetHeating from '~/components/widgets/Heating.vue'

  interface Device {
    certarn: string
    certid: string
    connection: boolean
    createdAt: string
    deviceid: string
    fw_version: string
    location: Object
    mac: string
    name: string
    state: { desired: Object, reported: Object }
    type: string
    users: []
  }

  interface DeviceStatus {
    deviceid: string
    connection?: boolean
    state?: {
      desired?: Object
      reported?: Object
    }
  }

  @Component({
    name: 'PageIndex',
    components: {
      WidgetSwitch,
      WidgetSwitch1: WidgetSwitch,
      WidgetThermy: WidgetSwitch,
      WidgetShutter,
      WidgetHeating,
      WidgetHeating1: WidgetHeating
    }
  })
  export default class PageIndex extends Vue {
    private socket?: SocketIOClient.Socket
    private devices: Device[] = []

    async mounted() {
      this.socket = SocketIO.connect('https://api.controlcloud.io/')

      this.socket.on('connect', this.authSocket)
      this.socket.on('reconnect', this.authSocket)
      // this.socket.on('unauthorized', () => {})
      this.socket.on('deviceStatus', this.deviceStatus)

      await this.$nextTick()
      this.devices = await this.$axios.$get<Device[]>(this.$auth.signUrl('/user/devices'))
    }

    beforeDestroy() {
      this.socket?.close()
    }

    private authSocket() {
      this.socket?.emit('authenticate', this.$auth.socketCreds)
    }

    private deviceStatus(status: DeviceStatus) {
      const device = this.devices.find(item => item.deviceid === status.deviceid)

      if(!device) {
        return
      }

      if(status.connection !== undefined) {
        device.connection = status.connection
      }

      if(status.state?.desired) {
        device.state.desired = status.state.desired
      }

      if(status.state?.reported) {
        device.state.reported = status.state.reported
      }
    }

    private deviceTypeToComponentName(type: string) {
      return 'Widget' + type.charAt(0).toUpperCase() + type.slice(1)
    }

    private isComponentForDeviceType(type: string) {
      return this.deviceTypeToComponentName(type) in (this.$options.components || {})
    }
  }
</script>

<style scoped>

</style>
