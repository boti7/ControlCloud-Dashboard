<template>
  <widget :device="device">
    <button type="button" class="ctrlbtn widget-shutter-btn rect-m"
            :class="{ 'desired': isStateDesired('up'), 'reported': isStateReported('up') }">
      UP
    </button>
    <button type="button" class="ctrlbtn widget-shutter-btn rect-m"
            :class="{ 'desired': isStateDesired('stop'), 'reported': isStateReported('stop') }">
      STOP
    </button>
    <button type="button" class="ctrlbtn widget-shutter-btn rect-m"
            :class="{ 'desired': isStateDesired('down'), 'reported': isStateReported('down') }">
      DOWN
    </button>
  </widget>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'
  import Widget from '~/components/Widget.vue'

  interface State {
    shutter1?: string
  }

  interface Device {
    connection: boolean
    deviceid: string
    name: string
    state?: {
      desired?: State,
      reported?: State
    }
    type: string
  }

  @Component({
    name: 'WidgetShutter',
    components: { Widget }
  })
  export default class WidgetShutter extends Vue {
    @Prop()
    device?: Device

    isStateDesired(checkState: string): boolean {
      return this.device?.state?.desired?.shutter1 === checkState
    }

    isStateReported(checkState: string): boolean {
      return this.device?.state?.reported?.shutter1 === checkState
    }
  }
</script>

<style scoped>
  .rect-m {
    height: 30px;
    width: 130px;
    border-radius: 3px;
    margin: 5px auto;
  }

  .ctrlbtn {
    margin: 5px auto 8px;
    background: none;
    display: block;
    border: 1px solid rgb(197, 197, 197);
    cursor: pointer;
    outline: none;
  }
  .ctrlbtn:active {
    box-shadow: rgb(197, 197, 197) 0px 0px 10px -1px inset;
  }
  .ctrlbtn[disabled] {
    cursor: not-allowed;
    background-color: rgb(233, 233, 233);
  }

  .ctrlbtn.desired {
    border: 1px solid rgb(0, 197, 0);
  }
  .ctrlbtn.reported {
    color: rgb(0, 197, 0);
  }

</style>
