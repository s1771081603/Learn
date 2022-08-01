import { assign, hasIntersectionObserver, isObject } from './util'
import { loadImage } from './loader'

const LifecycleEnum = {
  LOADING: 'loading',
  LOADED: 'loaded',
  ERROR: 'error',
}

const DEFAULT_OBSERVER_OPTIONS = {
  rootMargin: '0px',
  threshold: 0,
}

const DEFAULT_LOADING = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
const DEFAULT_ERROR = ''

export default class Lazy {
  lazyActive = true // 是否开启懒加载
  options = {
    loading: DEFAULT_LOADING,
    error: DEFAULT_ERROR,
    observerOptions: DEFAULT_OBSERVER_OPTIONS,
    log: true,
  }

  _images = new WeakMap()

  constructor(flag = true, options) {
    this.lazyActive = flag
    this.config(options)
  }

  config(options = {}) {
    assign(this.options, options)
  }

  // mount
  mount(el, binding, callback) {
    const { src, loading, error } = this._valueFormatter(binding)
    el.setAttribute('lazy', LifecycleEnum.LOADING)
    el.setAttribute('src', loading || DEFAULT_LOADING)
    if (!this.lazyActive) {
      this._setImageSrc(el, src, callback, error)
    }
    else {
      if (!hasIntersectionObserver) {
        this._setImageSrc(el, src, callback, error)
        this._log(() => {
          throw new Error('Not support IntersectionObserver!')
        })
      }
      this._initIntersectionObserver(el, src, callback, error)
    }
  }

  // resize
  resize(el, callback) {
    const lazy = el.getAttribute('lazy')
    const src = el.getAttribute('src')
    if (lazy && lazy === LifecycleEnum.LOADED && src) {
      loadImage(src).then((image) => {
        const { width, height } = image
        const curHeight = (el.width / width) * height
        el.height = curHeight
        const style = el.style
        style.height = `${curHeight}px`
        callback()
      })
    }
  }

  // unmount
  unmount(el) {
    const imgItem = this._realObserver(el)
    imgItem && imgItem.unobserve(el)
    this._images.delete(el)
  }

  /**
   * 设置img的src
   * @param {*} el - img
   * @param {*} src - 原图
   * @param {*} error - 错误图片
   * @param {*} callback - 完成的回调函数，通知组件刷新布局
   * @returns
   */
  _setImageSrc(el, src, callback, error) {
    if (!src)
      return

    const preSrc = el.getAttribute('src')
    if (preSrc === src)
      return

    loadImage(src)
      .then((image) => {
        // parent
        // const parent = el.parentElement as HTMLElement
        // const pWidth = parent.clientWidth
        // const pHeight = (pWidth / width) * height
        // const style = parent.style as CssStyleObject
        // style.height = `${pHeight}px`
        // 先清空，避免加载图在修改尺寸后被拉伸
        el.setAttribute('lazy', LifecycleEnum.LOADED)
        el.removeAttribute('src')
        el.setAttribute('src', src)
        const { width, height } = image
        const curHeight = (el.width / width) * height
        el.height = curHeight
        const style = el.style
        style.height = `${curHeight}px`
        callback()
      })
      .catch(() => {
        const imgItem = this._realObserver(el)
        imgItem && imgItem.disconnect()
        if (error) {
          el.setAttribute('lazy', LifecycleEnum.ERROR)
          el.setAttribute('src', error)
        }
        this._log(() => {
          throw new Error(`Image failed to load!And failed src was: ${src} `)
        })
        callback()
      })
  }

  _isOpenLazy() {
    return hasIntersectionObserver && this.lazyActive
  }

  /**
   * 添加img和对应的observer到weakMap中
   * 开启监听
   * 当出现在可视区域后取消监听
   * @param {*} el - img
   * @param {*} src - 图片
   * @param {*} error - 错误图片
   * @param {*} callback - 完成的回调函数，通知组件刷新布局
   */
  _initIntersectionObserver(el, src, callback, error) {
    const observerOptions = this.options.observerOptions
    this._images.set(
      el,
      new IntersectionObserver((entries) => {
        Array.prototype.forEach.call(entries, (entry) => {
          if (entry.isIntersecting) {
            const imgItem = this._realObserver(el)
            imgItem && imgItem.unobserve(entry.target)
            this._setImageSrc(el, src, callback, error)
          }
        })
      }, observerOptions),
    )

    const imgItem = this._realObserver(el)
    imgItem && imgItem.observe(el)
  }

  // 格式化参数
  _valueFormatter(value) {
    let src = value
    let loading = this.options.loading
    let error = this.options.error
    if (isObject(value)) {
      src = value.src
      loading = value.loading || this.options.loading
      error = value.error || this.options.error
    }
    return {
      src,
      loading,
      error,
    }
  }

  // 日志
  _log(callback) {
    if (this.options.log)
      callback()
  }

  // 在map中获取对应img的observer事件
  _realObserver(el) {
    return this._images.get(el)
  }
}
