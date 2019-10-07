import { Inertia, shouldIntercept } from '@inertiajs/inertia'

export default {
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    href: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      default: 'get',
    },
    replace: {
      type: Boolean,
      default: false,
    },
    preserveScroll: {
      type: Boolean,
      default: false,
    },
    preserveState: {
      type: Boolean,
      default: false,
    },
  },
  render(h) {
    const handler = event => {
      if (shouldIntercept(event)) {
        event.preventDefault()

        Inertia.visit(this.href, {
          data: this.data,
          method: this.method,
          replace: this.replace,
          preserveScroll: this.preserveScroll,
          preserveState: this.preserveState,
        })
      }
    }

    const scopedSlot = !this.$scopedSlots.$hasNormal &&
      this.$scopedSlots.default &&
      this.$scopedSlots.default({
        href: this.href,
        navigate: handler,
      })

    if (scopedSlot) {
      if (scopedSlot.length === 1) {
        return scopedSlot[0]
      } else if (scopedSlot.length > 1 || !scopedSlot.length) {
        return scopedSlot.length === 0 ? h() : h('span', {}, scopedSlot)
      }
    }

    return h('a', {
      ...this,
      attrs: {
        ...this.attrs,
        href: this.href,
      },
      on: {
        ...(this.on || {}),
        click: event => {
          if (this.on && this.on.click) {
            this.on.click(event)
          }

          handler(event)
        },
      },
    }, this.$slots.default)
  },
}
