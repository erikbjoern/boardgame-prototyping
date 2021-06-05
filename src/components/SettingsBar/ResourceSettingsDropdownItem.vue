<template>
  <div class="flex flex-col w-full flex-none rounded overflow-hidden">
    <div
      class="flex w-full p-2 transition-colors duration-300"
      :style="{
        backgroundColor: expanded ? item.invertedColor : item.color,
      }"
    >
      <div class="flex-1 relative">
        <input
          class="font-semibold w-full bg-transparent mr-2 transition-colors duration-300"
          name="name"
          v-model.lazy="item.name"
          :style="{ color: expanded ? item.color : item.invertedColor }"
          @keydown.esc="handleEscapeKey"
        />
        <div 
          v-if="tab == 'LANDSCAPES'"
          class="absolute right-[0.5rem] top-0 grid place-items-center h-full">
          <svg
            class="transition-all duration-300 select-none cursor-pointer hover:opacity-50 transform"
            :class="expanded ? 'rotate-180 translate-y-px' : '-translate-y-px'"
            :style="{
              color: expanded ? item.color : item.invertedColor,
            }"
            @click="expanded = !expanded"
            viewBox="0 0 24 24"
            height="20"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              xmlns="http://www.w3.org/2000/svg"
              d="M5.29289 6.29289C5.68342 5.90237 6.31658 5.90237 6.70711 6.29289L12 11.5858L17.2929 6.2929C17.6834 5.90237 18.3166 5.90237 18.7071 6.2929C19.0976 6.68342 19.0976 7.31658 18.7071 7.70711L12.7071 13.7071C12.3166 14.0976 11.6834 14.0976 11.2929 13.7071L5.29289 7.70711C4.90237 7.31658 4.90237 6.68342 5.29289 6.29289ZM5.29289 12.2929C5.68342 11.9024 6.31658 11.9024 6.70711 12.2929L12 17.5858L17.2929 12.2929C17.6834 11.9024 18.3166 11.9024 18.7071 12.2929C19.0976 12.6834 19.0976 13.3166 18.7071 13.7071L12.7071 19.7071C12.3166 20.0976 11.6834 20.0976 11.2929 19.7071L5.29289 13.7071C4.90237 13.3166 4.90237 12.6834 5.29289 12.2929Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>
      <div
        class="w-24 rounded-lg flex items-center"
        :style="{ backgroundColor: item.invertedColor }"
      >
        <input
          class="font-semibold bg-transparent text-sm w-full text-center"
          name="color"
          v-model.lazy="itemColor"
          :style="{ color: item.color }"
          @keydown.esc="handleEscapeKey"
        />
      </div>
    </div>
    <div
      v-if="expanded"
      class="flex flex-col items-stretch space-y-2 p-2"
      :style="{
        backgroundColor: item.color,
        color: item.invertedColor,
      }"
    >
      <label class="inline-flex justify-between font-semibold">
        min
        <div class="inline-block w-20 pl-1">
          <div class="bg-white w-8 rounded">
            <input
              class="text-gray-900 font-semibold text-center w-8"
              :style="{ backgroundColor: `${item.color}99` }"
              type="number"
              name="min"
              :value="item.min"
              @change="submitChange"
              @keydown.enter="submitChange"
              @keydown.esc="handleEscapeKey"
            />
          </div>
        </div>
      </label>
      <label class="inline-flex justify-between font-semibold">
        max
        <div class="inline-block w-20 pl-1">
          <div class="bg-white w-8 rounded">
            <input
              class="text-gray-900 font-semibold text-center w-8"
              :style="{ backgroundColor: `${item.color}99` }"
              type="number"
              name="max"
              :value="item.max"
              @change="submitChange"
              @keydown.enter="submitChange"
              @keydown.esc="handleEscapeKey"
            />
          </div>
        </div>
      </label>
      <label class="inline-flex justify-between font-semibold">
        fördelning
        <div class="inline-flex w-20 pl-1">
          <div class="bg-white w-8 rounded">
            <input
              class="text-gray-900 font-semibold text-center w-8"
              :style="{ backgroundColor: `${item.color}99` }"
              type="text"
              name="fraction"
              :value="item.fraction"
              @change="submitChange"
              @keydown.enter="submitChange"
              @keydown.esc="handleEscapeKey"
            />
          </div>
          <span class="ml-2">/</span>
          <span class="ml-1">{{ $store.getters.itemDistributionSum }}</span>
        </div>
      </label>
    </div>
  </div>
</template>

<script>
import WoodIcon from '@/assets/icons/log.svg'
import StoneIcon from '@/assets/icons/stone-block.svg'
import WheatIcon from '@/assets/icons/wheat.svg'
import colors from '@/assets/colors'
import { getInvertedHexColor } from '@/helpers/getDynamicColor'

export default {
  name: 'SettingsInputLandscapes',
  components: {
    WoodIcon,
    StoneIcon,
    WheatIcon,
  },
  props: ['item', 'tab'],
  data() {
    return {
      colors,
      expanded: false,
    }
  },
  computed: {
    itemColor: {
      get() {
        return this.item.color
      },
      set(value) {
        let color = value.slice(0, 7)

        if (!/^#dddddd/.test(color)) {
          let split = value.replace('#', '').split('')

          if (split.length == 3) {
            split = split.map(v => (v = v + v))
          }

          color = ['#', ...split].join('')
        }

        this.item.color = color
        this.item.invertedColor = getInvertedHexColor(color)
      },
    },
  },
  methods: {
    getInvertedHexColor,
    submitChange(e) {
      const value = property !== 'fraction' ? parseInt(e.target.value) : e.target.value
      const item = this.item
      const property = e.target.name

      if (!value) {
        e.target.value = item[property]
        return
      }

      this.$store.commit('setLandscapeParameter', {
        value,
        itemName: item.name,
        property,
      })

      if (e.type == 'keydown') {
        e.target.blur()
      }
    },
    handleEscapeKey(e) {
      const property = e.target.name
      e.target.value = this.item[property]
      e.target.blur()
    },
  },
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
}

input::-webkit-inner-spin-button,
input::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
</style>
