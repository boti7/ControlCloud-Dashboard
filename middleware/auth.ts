import { Middleware } from '@nuxt/types'

const authMiddleware: Middleware = (context) => {
  if(context.route.name !== 'login' && !context.app.$auth.isLoggedIn) {
    context.redirect('/login')
  }
  else if(context.route.name === 'login' && context.app.$auth.isLoggedIn) {
    context.redirect('/')
  }
}

export default authMiddleware
