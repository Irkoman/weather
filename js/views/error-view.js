import App from '../app'
import AbstractView from './abstract-view'

const ERROR_TEXTS = {
  'internalServerError': 'Что-то пошло не так. Но мы уже работаем над этим и скоро починим.',
  'empty': 'Ни один из вариантов не подходит под выбранные фильтры, попробуйте <span class="error-message-reset" role="button">сбросить фильтры</span> или смягчить условия поиска.'
}

class ErrorView extends AbstractView {
  constructor (errorName) {
    super()
    this._errorName = errorName
  }

  getMarkup () {
    return `
      <div class="error-message">
        <p>${ERROR_TEXTS[this._errorName]}</p>
      </div>
    `
  }

  bindHandlers () {
    const resetButton = this.element.querySelector('.error-message-reset')

    if (resetButton) {
      resetButton.addEventListener('click', (e) => {
        if (e.target.closest('.cities-all')) {
          App.resetSortParams()
        } else {
          App.resetFilterParams()
        }
      })
    }
  }
}

export default (errorName = 'internalServerError') => new ErrorView(errorName).element
