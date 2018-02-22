const watch = require('watch')
const glob  = require('glob')
const path  = require('path')
const _  = require('lodash')

function WatchPlugin(options) {
  this.options = options
  this.monitor = null
  this.initializedOnWatch = false
  this.watchedFiles = []
}

WatchPlugin.prototype.apply = function(compiler) {
  const context = this.options.context
  const liveReload = this.options.liveReload

  const createMonitor = () => {
    // Update watched files
    this.options.files.forEach((file) => {
      const filesPath = path.join(context, file)
      const newFiles = glob.sync(filesPath)
      this.watchedFiles = this.watchedFiles.concat(newFiles)
    })

    watch.createMonitor(context, (monitor) => {
      monitor.on("changed", _.debounce(onChange.bind(this), 500))

      monitor.on("created",  _.debounce((file) => { updateMonitor(file, 'created', monitor) }, 500))
      monitor.on("removed", (file) => { updateMonitor(file, 'removed', monitor) })
    })
  }

  const onChange = (file) => {
    if (this.watchedFiles.indexOf(file) < 0) return

    if (liveReload) {
      liveReload.lastHash = null
    }

    compiler.run((err, stats) => {
      if(err) {
        throw err
      } else {
        console.log('Asset changed', file)
      }
    })
  }

  const updateMonitor = (file, status, monitor) => {
    console.log('\n', `Asset ${status}: ${file}`, '\n')

    monitor.stop()
    this.watchedFiles = []
    createMonitor()
    onChange()
  }

  // Initialize watch
  compiler.plugin("watch-run", (compilation, callback) => {
    if (this.initializedOnWatch) {
      callback()
      return
    }

    this.initializedOnWatch = true
    createMonitor()
    callback()
  })
}

module.exports = WatchPlugin
