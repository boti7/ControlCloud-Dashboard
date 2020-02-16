<template>
  <b-col :cols="colsXs" :md="colsMd" :lg="colsLg" :xl="colsXl" class="mb-3">
    <div class="widget">
      <div class="widget-header">
        <div :class="{ 'connection-point': true, 'online': device.connection }"></div>
        <div class="device-name">{{ device.name }}</div>
        <div class="options" @click="$router.push('/device/' + device.deviceid)">
          <BIconGear />
        </div>
      </div>

      <div class="widget-controls">
        <slot />
      </div>
    </div>
  </b-col>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'
  import { BIconGear } from 'bootstrap-vue'

  interface Device {
    connection: boolean
    deviceid: string
    name: string
  }

  @Component({
    name: 'Widget',
    components: { BIconGear }
  })
  export default class Widget extends Vue {
    @Prop()
    size?: number

    @Prop()
    device?: Device

    get colsXs() {
      return (this.size || 1) * 6
    }

    get colsMd() {
      return (this.size || 1) * 4
    }

    get colsLg() {
      return (this.size || 1) * 3
    }

    get colsXl() {
      return (this.size || 1) * 2
    }
  }
</script>

<style scoped>
  .widget {
    width: 100%;
    float: left;
    background-color: white;
    border: 1px solid #E3E3E3;
  }

  .widget-header {
    padding: 0.5rem 0.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .connection-point {
    display: block;
    width: 7px;
    height: 7px;
    margin: 0 3px 0 4px;
    background: white;
    border: 1px solid rgb(149, 142, 151);
    border-radius: 5px;
  }
  .connection-point.online {
    background: rgb(0, 197, 0);
    border-color: rgb(0, 197, 0);
  }

  .device-name {
    color: #2F54A5;
    cursor: default;
  }

  .options {
    cursor: pointer;
    transition: opacity 200ms;
  }

  @media screen and (min-width: 768px) {
    .options {
      opacity: 0;
    }
    .widget-header:hover .options {
      opacity: 1;
    }
  }
</style>
