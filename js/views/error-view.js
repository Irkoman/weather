import AbstractView from './abstract-view'

class ErrorView extends AbstractView {
  getMarkup () {
    return `<p class="error-message">Технические неполадки</p>`
  }
}

export default () => new ErrorView().element
