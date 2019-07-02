const { adServiceApi } = require('./config')
const _ = require('./utils')
const generateAdNode = require('./ad')

/**
 * Loding AD to user's interface
 * @param {func} onAdLoaded        onAdLoaded Listener passed by user
 * @param {func} onAdFailed        onAdFailed Listener passed by user
 * @param {string} adType          AD type speicfy by user
 * @param {boolean} isAutoloaded   is auto load AD speicfy by user
 */
module.exports = function loadAd (onAdLoaded, onAdFailed, adType, isAutoloaded) {
  const isApiExist = !!adServiceApi
  if (!isApiExist)  console.error('AD api does not exist, please notify adminstrator')
  const adURL = `${adServiceApi}/ads`

  fetch(adURL)
  .then(res => res.json())
  .then(data => {
    const isRenderAd = checkIfRenderAd(data, adType)
    if (!isRenderAd) {
      return _.isFunction(onAdFailed)
        ? onAdFailed({ errMsg: 'No add has been loaded or ad type is other' })
        : console.error('No add has been loaded or ad type is other')
    }
    
    if (!isAutoloaded) {
      return _.isFunction(onAdLoaded)
        ? onAdLoaded(() => renderAd(generateAdNode(data)))
        : console.error('You have to specify "onAdLoaded" listener in order to control the timing to show ad')
    }

    renderAd(generateAdNode(data))
  })
  .catch(e => {
    console.error('error occured at loading ad:', e)
    if (_.isFunction(onAdFailed)) onAdFailed({ errMsg: e.message })
  })
}

/**
 * Check if Advertisment data is valid and ad type is what user specified
 * @param {object} data   Advertisment data
 * @param {string} adType ad type speicfy by user 
 */
function checkIfRenderAd (data, adType) {
  const { success, type } = data
  if (!success) return false
  if (adType && (type !== _.toUpper(adType))) return false
  return true
}

/**
 * Render AD
 * @param {object} adNode html dom node of ad
 */
function renderAd (adNode) {
  const adContainer = document.createElement('div')
  adContainer.innerHTML = adNode
  const body = document.getElementsByTagName('body')[0]
  body.appendChild(adContainer)
  window.closeAd = closeAd
}

/**
 * Close AD
 */
function closeAd () {
  const ad = document.getElementById('ad-overlay')
  ad.remove()
}
