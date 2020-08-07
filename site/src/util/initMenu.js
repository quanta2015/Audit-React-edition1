var initMenu=()=>{
  if (document.querySelector('html').clientWidth<1000) {
    document.querySelector('.g-menu').classList.remove('fn-hide')
  }
}

export default initMenu
