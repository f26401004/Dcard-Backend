const ipchecker = require('ipchecker')
const level = require('level')
const ipDB = level('./ip_database', { valueEncoding: 'json' })

ipDB.open(function (error) {
  console.log(error)
})

const defaults = {
  duration: 24 * 60 * 60 * 1000,
  max: 500,
  whiteList: [],
  blackList: [],
  accessForbidden: '403: You are forbidden.',
  accessLimited: '429: Too many requests.'
}

module.exports = function (options) {
  options = options || {}
  // set the field with default value
  for (let key in defaults) {
    if (options[key]) {
      continue
    }
    options[key] = defaults[key]
  }
  console.log(options)
  // get white/black list map from options
  const whiteListMap = ipchecker.map(options.whiteList)
  const blackListMap = ipchecker.map(options.blackList)

  return async function (req, res, next) {
    const ip = req.ip

    /// block the ip in black list
    if (ipchecker.check(ip, blackListMap)) {
      res.status(403).send(options.accessForbidden)
    }
    // next directly if the ip in white list
    if (ipchecker.check(ip, whiteListMap)) {
      next()
    }

    const now = Date.now()
    const reset = now + options.duration

    let target
    try {
      target = await ipDB.get(ip)
    } catch (error) {
      console.log(error)
      await ipDB.put(ip, {
        reset: reset,
        limit: options.max
      })
      target = {
        reset: reset,
        limit: options.max
      }
    }
    target.limit = target.limit - 1
    // save the data
    await ipDB.put(ip, {
      reset: reset,
      limit: target.limit
    })
    
    if (now < target.reset) {
      res.set('X-RateLimit-Remaining', target.limit > 0 ? target.limit : 0)
    }
    // reset the limit ans reset if limit < 0 and reset < now
    if (target.limit < 0 && target.reset < now) {
      console.log('test')
      target.reset = reset
      target.limit = options.max
      await ipDB.put(ip, target)
      res.set('X-RateLimit-Remaining', options.max)
    }

    res.set('X-RateLimit-Reset', target.reset)

    // if limit less than zero, then send 429 message
    if (target.limit < 0) {
      res.set('Retry-After', Math.ceil((target.reset - now) / 1000))
      res.status(429).send(options.accessLimited)
      return
    }

    return next()
    
  }
}
