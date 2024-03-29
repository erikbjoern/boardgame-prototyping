<template>
  <div class="flex flex-col" style="width: calc(310px - 1.25rem) !important">
    <div
      class="flex w-full p-2 rounded"
      :class="[
        expanded && 'rounded-b-none',
        !colorPickerIsOpen && 'transition-colors duration-300',
      ]"
      :style="{
        backgroundColor: expanded ? invertedTemporaryItemColor : temporaryItemColor,
      }"
    >
      <div
        class="flex-shrink w-1/2 relative font-semibold"
        :class="!colorPickerIsOpen && 'transition-colors duration-300'"
        :style="{ color: expanded ? temporaryItemColor : invertedTemporaryItemColor }"
      >
        <span v-if="parentTab == 'adjustBoard'">
          {{ name }}
        </span>
        <input
          v-else
          class="w-full bg-transparent mr-2 font-semibold"
          name="name"
          v-model.lazy="name"
          @keydown.esc="handleEscapeKey"
          :ref="item.name"
          @focus="$store.commit('inputFocused')"
          @blur="$store.commit('inputBlurred')"
        />
      </div>
      <div
        v-if="expandable && tab == 'landscapes'"
        class="grid place-items-center h-full w-8"
      >
        <svg
          class="select-none cursor-pointer hover:opacity-50 transform"
          :class="[
            expanded ? 'rotate-180 translate-y-px' : '-translate-y-0',
            !colorPickerIsOpen && 'transition-all duration-300',
          ]"
          :style="{
            color: expanded ? temporaryItemColor : invertedTemporaryItemColor,
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
      <div class="w-1/2 flex-shrink flex items-center">
        <div
          class="grid place-items-center ml-auto overflow-hidden"
          :class="[
            removalMode
              ? 'cursor-pointer rounded-lg h-5 w-5 shadow'
              : 'rounded-md h-full w-20',
            !colorPickerIsOpen && 'transition-all duration-300',
          ]"
          :style="{
            backgroundColor: removalMode ? '#992222' : invertedTemporaryItemColor,
          }"
        >
          <transition name="fade" mode="out-in">
            <div v-if="!removalMode" class="w-full">
              <input
                v-model="temporaryItemColor"
                type="color"
                class="absolute opacity-0 ml-5"
                :id="`color-for-${item.name}`"
                @click="colorPickerIsOpen = true"
                v-click-outside="() => (colorPickerIsOpen = false)"
              />
              <input
                :value="temporaryItemColor"
                type="text"
                @keydown.esc="handleEscapeKey"
                @keydown.enter="submitChange"
                @change="submitChange"
                name="color"
                class="bg-transparent text-center w-full font-semibold text-sm"
                :style="{ color: temporaryItemColor }"
              />
            </div>
            <button v-else @click="remove(item)">
              <svg
                fill="none"
                viewBox="0 0 24 24"
                height="15"
                width="15"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
                  fill="#fff"
                ></path>
              </svg>
            </button>
          </transition>
        </div>
      </div>
    </div>
    <div
      v-if="expandable && expanded"
      class="flex flex-col items-stretch space-y-2 p-2 rounded-b"
      :style="{
        backgroundColor: temporaryItemColor,
        color: invertedTemporaryItemColor,
      }"
    >
      <label
        class="inline-flex justify-center space-x-2 transform -translate-x-1 font-semibold"
      >
        <span>fördelning</span>
        <div class="inline-flex">
          <div
            class="w-8 rounded"
            :style="{ backgroundColor: `${invertedTemporaryItemColor}aa` }"
          >
            <input
              class="font-semibold text-center w-8 bg-transparent"
              :style="{ color: temporaryItemColor }"
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
          class="flex justify-between p-2 w-full rounded"
          :style="{
            backgroundColor: resourceColors[resource.name].main,
            color: resourceColors[resource.name].inverted,
          }"
        >
          <span class="inline-block flex-1 font-semibold">{{ resource.name }}</span>
          <div
            class="grid place-items-center ml-auto transition-all overflow-hidden"
            :class="
              removalMode
                ? 'cursor-pointer rounded-lg h-5 w-5 shadow'
                : 'rounded-md h-full w-[8.75rem]'
            "
          >
            <transition name="fade" mode="out-in">
              <div v-if="!removalMode" class="flex space-x-2">
                <label class="inline-flex justify-between font-semibold">
                  min
                  <div class="inline-block pl-1">
                    <div class="bg-white w-8 bg-opacity-10 rounded overflow-hidden">
                      <input
                        class="text-gray-900 font-semibold text-center w-8 bg-transparent"
                        :style="{
                          color: resourceColors[resource.name].inverted,
                        }"
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
                        :style="{
                          color: resourceColors[resource.name].inverted,
                        }"
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
              <div
                v-else
                class="grid place-items-center ml-auto transition-colors duration-200 delay-200 cursor-pointer rounded-lg h-5 w-5 shadow bg-[#992222]"
              >
                <button @click="remove(resource)">
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    height="15"
                    width="15"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
                      fill="#fff"
                    ></path>
                  </svg>
                </button>
              </div>
            </transition>
          </div>
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
            color: resourceColors[resource.name].inverted,
            backgroundColor: resourceColors[resource.name].main,
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
import vClickOutside from 'v-click-outside'
import { getInvertedHexColor, getRGBValues } from '@/helpers/getDynamicColor'

export default {
  name: 'LandscapeOrResourceItem',
  directives: {
    vClickOutside,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    tab: {
      type: String,
      required: false,
    },
    parentTab: {
      type: String,
      required: false,
    },
    focusAddedItem: {
      type: Boolean,
      default: false,
    },
    removalMode: {
      type: Boolean,
      default: false,
    },
    expandable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      expanded: false,
      temporaryItemColor: '',
      colorPickerIsOpen: false,
    }
  },
  computed: {
    invertedTemporaryItemColor() {
      return getInvertedHexColor(this.temporaryItemColor)
    },
    name: {
      get() {
        return this.item.name
      },
      set(value) {
        const currentDataSet = this.tab.toLowerCase()

        if (this.$store.state[currentDataSet].data.find(i => i.name == value)) {
          const message = `Det finns redan ${
            this.tab == 'landscapes' ? 'ett landskap' : 'en resurs'
          } med detta namn`
          alert(message)
          this.$refs[this.item.name].value = this.item.name
        } else {
          const mutation =
            this.tab == 'landscapes' ? 'setLandscapeParameter' : 'setResourceParameter'
          this.$store.commit(mutation, { name: this.item.name, property: 'name', value })
        }
      },
    },
    otherAvailableResources() {
      return this.$store.state.resources.data.filter(
        r => !this.item.resources.map(res => res.name).includes(r.name)
      )
    },
    resourceColors() {
      return this.parentTab == 'newBoard' ? this.$store.getters.resourceColors : this.$store.state.board.colors.resources
    },
  },
  methods: {
    getInvertedHexColor,
    submitChange(e, resourceName = null) {
      let resource
      const item = this.item
      const property = e.target.name

      let value = ['min', 'max', 'fraction'].includes(property)
        ? parseInt(e.target.value)
        : e.target.value

      if (resourceName) {
        resource = item.resources.find(r => r.name == resourceName)
      }

      if ([undefined, null, '', NaN].includes(value)) {
        return (e.target.value = resource ? resource[property] : item[property])
      }

      if (property == 'color') {
        // if user sets value to black, keep a hint of color so that the inverted color is slightly colored
        // unless the value already is set to minimum, in that case, set it to actual black
        if (value == '#000' || value == '#000000') {
          const rgbValues = getRGBValues(item.color)
          const max = Math.max(...rgbValues)
          value =
            max <= 5
              ? '#000000'
              : '#' + rgbValues.map(v => (v == max ? '05' : '00')).join('')
        }

        this.temporaryItemColor = value
      }

      this.$emit('change', item, property, value, resource)

      if (e.type == 'keydown') {
        e.target.blur()
      }
    },
    handleEscapeKey(e) {
      const property = e.target.name
      e.target.value = this.item[property]
      e.target.blur()
    },
    remove(item) {
      let action

      if (this.tab == 'resources') action = 'removeResource'

      if (this.tab == 'landscapes') {
        action = item == this.item ? 'removeLandscape' : 'removeResourceFromLandscape'
      }

      this.$store.dispatch(action, {
        name: item.name,
        ...(action == 'removeResourceFromLandscape' && {
          landscapeName: this.item.name,
        }),
      })
    },
  },
  mounted() {
    if (this.focusAddedItem) {
      const currentDataSet = this.$store.state[this.tab].data

      const lastItem = currentDataSet.slice(-1)[0]

      if (lastItem?.name == this.item.name) {
        this.$refs[this.item.name]?.focus()
        this.$emit('didFocusAddedItem')
      }
    }

    this.temporaryItemColor = this.item.color
  },
  watch: {
    temporaryItemColor(newValue, oldValue) {
      if (!oldValue) return

      if (this.debounceColorChange) {
        clearTimeout(this.debounceColorChange)
      }

      this.debounceColorChange = setTimeout(() => {
        this.$emit('change', this.item, 'color', newValue)
      }, 500)
    },
    'item.color'(value) {
      this.temporaryItemColor = value
    },
  },
}
</script>

<style scoped>
input::-webkit-inner-spin-button,
input::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
</style>
