/**
 * const
 */
const actions = [
    'getFormValues',
    'checkFormValues',
    'setFormValues'
]

/**
 * Page query
 */
function pageQuery(keyword) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
        chrome.tabs.sendMessage(
            tab[0].id, {
            actionKey: keyword
        },function(response){
            if(response === 'close'){
                window.close()
            }
        })
    })
}

/**
 * Init
 */
function init() {
    actions.map((key) => {
        document.querySelector('#'+key).addEventListener('click',function(){pageQuery(key) })
    })
}

/**
 * onload
 */
window.onload = init
