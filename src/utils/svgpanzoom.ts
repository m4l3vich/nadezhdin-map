import { DirectiveBinding } from 'vue'

type InitCallback = () => void

async function getClientDependencies () {
  const Hammer = (await import('hammerjs')).default
  const svgPanZoom = (await import('svg-pan-zoom')).default

  return { Hammer, svgPanZoom }
}

export const vSvgPanZoom = async function (el: SVGSVGElement, binding: DirectiveBinding) {
  if (typeof window === 'undefined') return

  const { Hammer, svgPanZoom } = await getClientDependencies()

  let hammer: HammerManager
  const eventsHandler: SvgPanZoom.CustomEventHandler = {
    haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel'],
    init: function (options) {
      const instance = options.instance
      let initialScale = 1
      let pannedX = 0
      let pannedY = 0
  
      // Init Hammer
      // Listen only for pointer and touch events
      hammer = new Hammer(options.svgElement, {
        inputClass: window.PointerEvent ? Hammer.PointerEventInput : Hammer.TouchInput
      })
  
      // Enable pinch
      hammer.get('pinch').set({ enable: true })
  
      // Handle double tap
      hammer.on('doubletap', () => {
        instance.zoomIn()
      })
  
      // Handle pan
      hammer.on('panstart panmove', function (ev) {
        // On pan start reset panned variables
        if (ev.type === 'panstart') {
          pannedX = 0
          pannedY = 0
        }
  
        // Pan only the difference
        instance.panBy({ x: ev.deltaX - pannedX, y: ev.deltaY - pannedY })
        pannedX = ev.deltaX
        pannedY = ev.deltaY
      })
  
      // Handle pinch
      hammer.on('pinchstart pinchmove', function (ev) {
        // On pinch start remember initial zoom
        if (ev.type === 'pinchstart') {
          initialScale = instance.getZoom()
          instance.zoomAtPoint(initialScale * ev.scale, { x: ev.center.x, y: ev.center.y })
        }
  
        instance.zoomAtPoint(initialScale * ev.scale, { x: ev.center.x, y: ev.center.y })
      })
  
      // Prevent moving the page on some devices when panning over SVG
      options.svgElement.addEventListener('touchmove', function (e) { e.preventDefault() })
    },
  
    destroy: function () {
      hammer.destroy()
    }
  }

  const instance = svgPanZoom(el, {
    zoomEnabled: true,
    fit: true,
    center: true,
    customEventsHandler: eventsHandler
  })

  function toggle (enable: boolean) {
    if (hammer) hammer.set({ enable })
    if (enable) {
      instance.enableDblClickZoom()
      instance.enableMouseWheelZoom()
      instance.enablePan()
      instance.enableZoom()

      const callback = binding.value as InitCallback
      callback()
    } else {
      instance.disableDblClickZoom()
      instance.disableMouseWheelZoom()
      instance.disablePan()
      instance.disableZoom()

      instance.center()
      instance.fit()
    }
  }

  const media = window.matchMedia('(max-width: 960px)')
  media.addEventListener('change', () => {
    toggle(media.matches)
  })

  toggle(media.matches)
}