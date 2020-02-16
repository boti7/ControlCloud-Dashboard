<template>
  <widget :device="device">
    <button type="button" class="ctrlbtn widget-switch1-pwrbtn circle-m"
            :class="{ 'desired': isStateDesired(), 'reported': isStateReported() }">
      <img src="~/assets/lamp_green.png" class="ctrlbtn-icon" />
    </button>
  </widget>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'
  import Widget from '~/components/Widget.vue'

  interface State {
    out1?: boolean
    outputs?: {
      0?: {
        id: number,
        state: boolean
      }
    }
  }

  interface Device {
    connection: boolean
    deviceid: string
    name: string
    state: {
      desired: State,
      reported: State
    }
    type: string
  }

  @Component({
    name: 'WidgetSwitch',
    components: { Widget }
  })
  export default class WidgetSwitch extends Vue {
    @Prop()
    device?: Device

    isStateDesired(): boolean {
      const outputs = this.device?.state?.desired?.outputs || {}
      return outputs['0']?.state || this.device?.state?.desired?.out1 || false
    }

    isStateReported(): boolean {
      const outputs = this.device?.state?.reported?.outputs || {}
      return outputs['0']?.state || this.device?.state?.reported?.out1 || false
    }
  }
</script>

<style scoped>
  .circle-m {
    height: 100px;
    width: 100px;
    border-radius: 100px;
  }

  .ctrlbtn {
    margin: 5px auto 15px;
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

  .ctrlbtn-icon {
    width: 60px;
    -webkit-filter: grayscale(100%);
    filter: grayscale(100%);
    color: #333;
  }
  .ctrlbtn.desired {
    border: 1px solid rgb(0, 197, 0);
  }
  .ctrlbtn.reported .ctrlbtn-icon {
    -webkit-filter: grayscale(0%);
    filter: grayscale(0%);
  }
  .ctrlbtn.reported {
    color: rgb(0, 197, 0);
  }

</style>
