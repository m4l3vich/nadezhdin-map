<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Region } from '../main'

import MapSvg from '../assets/Map.svg'
import { regionsMap } from '../utils/regionMapping'
import { vSvgPanZoom } from '../utils/svgpanzoom'

const map = ref()
const root = ref()
const hover = ref()
const hoverItem = ref<{ count: number, name: string, percent: number }>()
const hoverTop = ref<number>()
const hoverLeft = ref<number>()
const showBorder = ref<boolean>(false)

const props = withDefaults(
  defineProps<{ regions: Region[], threshold: number }>(),
  { threshold: 2500 }
)

watch(map, renderMap)

function initObserver () {
  const observer = new IntersectionObserver(observerCallback, {
    root: root.value,
    threshold: 0.9
  })

  const viewport = map.value.$el.querySelector('.svg-pan-zoom_viewport')
  observer?.observe(viewport)
}

function observerCallback (entries: IntersectionObserverEntry[]) {
  showBorder.value = entries.some(e => !e.isIntersecting)
}

function renderMap () {
  if (!map.value) return
  const mapSvg = map.value.$el as SVGSVGElement

  const allRegions = mapSvg.querySelectorAll<SVGPathElement>('[data-code]')
  allRegions.forEach(e => {
    e.removeAttribute('fill-opacity')
    e.removeAttribute('style')
    e.addEventListener('mouseleave', () => {
      hoverItem.value = undefined
    })
    e.addEventListener('touchmove', () => hoverItem.value = undefined)
  })

  for (const [name, count] of props.regions) {
    const regionCode = regionsMap[name]
    const regionOnMap = mapSvg.querySelector<SVGPathElement>(`[data-code="${regionCode}"]`)

    if (!regionOnMap) {
      console.warn('No match for region: ' + name)
      continue
    }

    const percent = count / props.threshold
    regionOnMap.removeAttribute('style')
    regionOnMap.setAttribute('fill-opacity', (percent + 0.1).toString())

    if (percent >= 1) {
      regionOnMap.setAttribute('style', 'fill: var(--blue)')
    } else {
      regionOnMap.setAttribute('style', 'fill: var(--cyan)')
    }

    regionOnMap.addEventListener('mousemove', e => {
      hoverItem.value = { name, count, percent }
      hoverTop.value = e.offsetY + 16
      hoverLeft.value = e.offsetX
    })
  }
}
</script>

<template>
  <div
    ref="root"
    class="nadezhdin-map"
    :class="{ 'nadezhdin-map_show-border': showBorder }"
  >
    <MapSvg
      v-svg-pan-zoom="initObserver"
      ref="map"
    />

    <ul class="nadezhdin-map-legend">
      <li class="nadezhdin-map-legend__item nadezhdin-map-legend__item_blue">
        2500 и больше
      </li>

      <li class="nadezhdin-map-legend__item nadezhdin-map-legend__item_cyan">
        Меньше 2500
      </li>

      <li class="nadezhdin-map-legend__item nadezhdin-map-legend__item_grey">
        Нет
      </li>
    </ul>

    <div
      class="nadezhdin-map-hover"
      v-show="hoverItem"
      :style="{ top: `${hoverTop ?? 0}px`, left: `${hoverLeft ?? 0}px` }"
      ref="hover"
    >
      <template v-if="hoverItem">
        <span class="nadezhdin-map-hover__name" v-text="hoverItem.name" />
        <span
          class="nadezhdin-map-hover__count"
          :class="hoverItem.percent >= 1 ? 'nadezhdin-map-hover__count_blue' : 'nadezhdin-map-hover__count_cyan'"
          :style="{ opacity: hoverItem.percent }"
          v-text="hoverItem.count.toLocaleString('ru')"
        />
      </template>
    </div>
  </div>
</template>

<style lang="scss">
.nadezhdin-map {
  width: 100%;
  height: 100%;

  --cyan: #3A91C0;
  --blue: #3B66FF;
  --grey: #F2F2F2;

  position: relative;
  border-radius: 16px;
  border: 2px solid transparent;
  transition: border-color 0.3s ease;

  &_show-border {
    border-color: #DDD;
  }

  svg {
    width: 100%;
    height: 100%;
    border-radius: 16px;

    path {
      stroke: #FFFFFF;
      stroke-width: 1;
      stroke-linejoin: round;
    }

    [data-code] {
      fill: var(--grey);
      transition: fill 0.2s;
    }
  }
}

.nadezhdin-map-legend {
  position: absolute;
  top: 16px;
  left: 16px;

  display: flex;
  flex-direction: column;
  gap: 12px;

  margin: 0;
  padding: 0;

  &__item {
    display: flex;
    align-items: center;
    gap: 12px;

    &_blue { --marker_bg: var(--blue) }
    &_cyan { --marker_bg: linear-gradient(90deg, var(--cyan) 0%, #3a91c01a 100%) }
    &_grey { --marker_bg: var(--grey) }

    &::before {
      content: ' ';
      display: block;

      width: 24px;
      height: 24px;
      border-radius: 999px;
      background: var(--marker_bg);
    }
  }
}

.nadezhdin-map-hover {
  position: absolute;
  max-width: 200px;

  border-radius: 8px;
  padding: 12px;
  white-space: nowrap;
  pointer-events: none;

  display: flex;
  flex-direction: column;
  gap: 12px;
  background: white;
  box-shadow: 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12);
  
  &__count {
    &_blue { color: var(--blue) }
    &_cyan { color: var(--cyan) }

    font-size: 40px;
    line-height: 100%;
  }
}
</style>
