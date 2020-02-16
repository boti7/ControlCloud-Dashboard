<template>
  <widget size="2" :device="device">
    <div v-for="(n, index) in 7" :key="index" class="widget-heating-tile">
      <div class="widget-heating-room">{{ getRoomName(index) }}</div>
      <div class="widget-heating-desired">{{ getRoomDesiredTempStr(index) }}</div>
      <div class="widget-heating-reported" :class="{ 'is-heating': isRoomHeating(index) }">
        {{ getRoomReportedTempStr(index) }}
      </div>
    </div>

    <div class="widget-heating-tile">
      <div class="widget-heating-room">Boiler</div>
      <div v-if="boilerState" class="widget-heating-reported is-heating">Heating</div>
      <div v-else class="widget-heating-reported">Idle</div>
    </div>
  </widget>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'
  import Widget from '~/components/Widget.vue'

  interface StateRoom {
    id: number
    sensor: number
    temperature: number
  }

  interface StateOutput {
    id: number
    mode: string
    state: boolean
  }

  interface StateSensor {
    first_report: boolean
    id: number
    rssi: number
    temperature: number
    voltage: number
  }

  interface State {
    rooms?: {
      0?: StateRoom
      1?: StateRoom
      2?: StateRoom
      3?: StateRoom
      4?: StateRoom
      5?: StateRoom
      6?: StateRoom
    }
    outputs?: {
      0?: StateOutput
      1?: StateOutput
      2?: StateOutput
      3?: StateOutput
      4?: StateOutput
      5?: StateOutput
      6?: StateOutput
      7?: StateOutput
    }
    sensors?: {
      0?: StateSensor
      1?: StateSensor
      2?: StateSensor
      3?: StateSensor
      4?: StateSensor
      5?: StateSensor
      6?: StateSensor
    }
  }

  interface Device {
    configuration?: {
      rooms: {
        0: { name: string }
        1: { name: string }
        2: { name: string }
        3: { name: string }
        4: { name: string }
        5: { name: string }
        6: { name: string }
      }
    }
    connection: boolean
    deviceid: string
    name: string
    state?: {
      desired?: State
      reported?: State
    }
    type: string
  }

  @Component({
    name: 'WidgetHeating',
    components: { Widget }
  })
  export default class WidgetHeating extends Vue {
    @Prop()
    device?: Device

    get boilerState() {
      const reportedOutputs = <any>this.device?.state?.reported?.outputs || {}
      return reportedOutputs['7']?.state
    }

    getRoomName(index: number) {
      const rooms = <any>this.device?.configuration?.rooms || {}
      const room = <{name: string} | undefined>rooms[index.toString()]
      return room?.name || 'Room ' + (index + 1)
    }

    getRoomDesiredTempStr(roomIndex: number) {
      const desiredRooms = <any>this.device?.state?.desired?.rooms || {}
      const temp = desiredRooms[roomIndex.toString()]?.temperature

      return temp ? temp.toFixed(1) + '°C' : '--'
    }

    getRoomReportedTempStr(roomIndex: number) {
      const reportedRooms = <any>this.device?.state?.reported?.rooms || {}
      const reportedSensors = this.device?.state?.reported?.sensors
      const sensorId = <number | undefined>reportedRooms[roomIndex.toString()]?.sensor
      const sensorsArr = Object.values(reportedSensors || {})
      const temp = sensorsArr.find(item => item && item.id === sensorId)?.temperature

      return temp ? temp.toFixed(1) + '°C' : '--'
    }

    isRoomHeating(roomIndex: number) {
      const reportedOutputs = <any>this.device?.state?.reported?.outputs || {}

      return reportedOutputs[roomIndex.toString()]?.state
    }
  }
</script>

<style scoped>
  .widget-heating-tile {
    width: 25%;
    height: 90px;
    padding: 5px;
    float: left;
    text-align: center;
    cursor: pointer;
  }
  .widget-heating-tile:hover {
    background-color: #f0f0f0;
  }

  .widget-heating-desired {
    display: block;
    font-size: 20px;
  }

  .widget-heating-reported {
    color: green;
  }
  .widget-heating-reported.is-heating {
    color: red;
  }
</style>
