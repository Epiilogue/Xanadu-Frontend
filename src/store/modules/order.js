import Vue from 'vue'

const order = {
  state: {
    // selectedPro:Vue.prototype.$cache ? Vue.prototype.$cache.local.getJSON('selectedProduct'):[],
    // selectedPro:[],
    proChanged:1,
    cusChanged:1
  },

  mutations: {
    SET_PROCHANGED: (state, selectedPro) => {
      Vue.prototype.$cache.session.setJSON('selectedProduct', selectedPro)
      state.proChanged=(state.proChanged+1)%2
    },
    SET_CUSCHANGED: (state, selectedCustomer) => {
      Vue.prototype.$cache.session.setJSON('selectedCustomer', selectedCustomer)
      state.cusChanged=(state.cusChanged+1)%2
    }
  },

  actions: {
  }
}

export default order
