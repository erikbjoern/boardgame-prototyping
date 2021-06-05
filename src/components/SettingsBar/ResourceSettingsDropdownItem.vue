<template>
  <div class="flex flex-col w-full flex-none rounded overflow-hidden">
    <div
      class="flex w-full p-2 transition-colors duration-300"
      :style="{
        backgroundColor: expanded ? item.invertedColor : item.color,
      }"
    >
      <div class="flex-shrink w-1/2 relative">
        <input
          class="font-semibold w-full bg-transparent mr-2 transition-colors duration-300"
          name="name"
          v-model.lazy="item.name"
          :style="{ color: expanded ? item.color : item.invertedColor }"
          @keydown.esc="handleEscapeKey"
          :ref="item.name"
        />
      </div>
      <div v-if="tab == 'LANDSCAPES'" class="grid place-items-center h-full">
        <svg
          class="transition-all duration-300 select-none cursor-pointer hover:opacity-50 transform"
          :class="expanded ? 'rotate-180 translate-y-px' : '-translate-y-0'"
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
      <div class="w-1/2 flex-shrink pl-10">
        <div
          :style="{ backgroundColor: item.invertedColor }"
          class="rounded-md flex items-center h-full"
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
    </div>
    <div
      v-if="expanded"
      class="flex flex-col items-stretch space-y-2 p-2"
      :style="{
        backgroundColor: item.color,
        color: item.invertedColor,
      }"
    >
      <label
        class="inline-flex justify-center space-x-2 transform -translate-x-1 font-semibold"
      >
        <span>fördelning</span>
        <div class="inline-flex">
          <div
            class="w-8 rounded"
            :style="{ backgroundColor: `${item.invertedColor}aa` }"
          >
            <input
              class="font-semibold text-center w-8 bg-transparent"
              :style="{ color: item.color }"
              type="text"
              name="fraction"
              :value="item.fraction"
              @change="submitChange"
              @keydown.enter="submitChange"
              @keydown.esc="handleEscapeKey"
            />
          </div>
          <span class="ml-2">/</span>
          <span class="ml-1">{{ $store.getters.landscapeDistributionSum }}</span>
        </div>
      </label>
      <div v-if="item.resources" class="space-y-2">
        <div
          v-for="(resource, index) in item.resources"
          :key="resource.name + index"
          class="flex space-x-2 justify-between p-2 w-full rounded"
          :style="{
            backgroundColor: $store.getters.resourceColors[resource.name],
            color: $store.getters.invertedResourceColors[resource.name],
          }"
        >
          <span class="inline-block flex-1 font-semibold">{{ resource.name }}</span>
          <label class="inline-flex justify-between font-semibold">
            min
            <div class="inline-block pl-1">
              <div class="bg-white w-8 bg-opacity-10 rounded overflow-hidden">
                <input
                  class="text-gray-900 font-semibold text-center w-8 bg-transparent"
                  :style="{ color: $store.getters.invertedResourceColors[resource.name] }"
                  type="number"
                  name="min"
                  :value="resource.min"
                  @change="e => submitChange(e, resource.name)"
                  @keydown.enter="e => submitChange(e, resource.name)"
                  @keydown.esc="handleEscapeKey"
                />
              </div>
            </div>
          </label>
          <label class="inline-flex justify-between font-semibold">
            max
            <div class="inline-block pl-1">
              <div class="bg-white w-8 bg-opacity-10 rounded overflow-hidden">
                <input
                  class="text-gray-900 font-semibold text-center bg-transparent w-8"
                  :style="{ color: $store.getters.invertedResourceColors[resource.name] }"
                  type="number"
                  name="max"
                  :value="resource.max"
                  @change="e => submitChange(e, resource.name)"
                  @keydown.enter="e => submitChange(e, resource.name)"
                  @keydown.esc="handleEscapeKey"
                />
              </div>
            </div>
          </label>
        </div>
      </div>
      <select
        v-if="otherAvailableResources.length"
        class="decorated p-2 rounded text-gray-800"
        @change="
          e => {
            $store.commit('addResourceToLandscape', {
              landscape: item.name,
              resource: { name: e.target.value, min: 0, max: 0 },
            })
          }
        "
      >
        <option>
          Lägg till resurs
        </option>
        <option
          :style="{
            color: $store.getters.invertedResourceColors[resource.name],
            backgroundColor: $store.getters.resourceColors[resource.name],
          }"
          v-for="resource of otherAvailableResources"
          :key="resource.name"
          :value="resource.name"
        >
          {{ resource.name }}
        </option>
      </select>
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
  props: ['item', 'tab', 'focusAddedItem'],
  data() {
    return {
      colors,
      expanded: false,
    }
  },
  computed: {
    otherAvailableResources() {
      return this.$store.state.resources.data.filter(
        r => !this.item.resources.map(res => res.name).includes(r.name)
      )
    },
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
    submitChange(e, resource = null) {
      const item = this.item
      const property = e.target.name
      const value = parseInt(e.target.value)

      if ([undefined, null, '', NaN].includes(value)) {
        if (resource) {
          return (e.target.value = item.resources.find(r => r.name == resource)[property])
        }

        return (e.target.value = item[property])
      }

      let mutation

      if (resource) {
        mutation = 'setResourceValueOnLandscape'
      } else {
        mutation =
          this.tab == 'LANDSCAPES' ? 'setLandscapeParameter' : 'setResourceParameter'
      }

      this.$store.commit(mutation, {
        name: item.name,
        property,
        value,
        ...(resource && { resource }),
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
  mounted() {
    if (this.focusAddedItem) {
      const currentDataSet =
        this.tab == 'LANDSCAPES'
          ? this.$store.state.landscapes.data
          : this.$store.state.resources.data

      if (currentDataSet.slice(-1)[0].name == this.item.name) {
        this.$refs[this.item.name]?.focus()
        this.$emit('didFocusAddedItem')
      }
    }
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
