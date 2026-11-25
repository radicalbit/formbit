import App from '../App'

const TAKEN_EMAIL = 'taken@radicalbit.ai'
const SILENT_ERROR = 'This email is already registered'

describe('<BackendErrorsForm />', () => {
  beforeEach(() => {
    cy.mount(<App />)
    cy.getTab('backend').click()
    cy.get('input').eq(0).as('email')
  })

  it('Should show the backend error after submitting a taken email', () => {
    cy.get('@email').type(TAKEN_EMAIL)
    cy.button('submit').click()

    cy.get('[data-testid="silent-error"]').should('contain.text', SILENT_ERROR)
    cy.shouldNotSubmit()
  })

  it('Should keep the submit button enabled while the backend error is shown', () => {
    cy.get('@email').type(TAKEN_EMAIL)
    cy.button('submit').click()

    cy.get('[data-testid="silent-error"]').should('exist')
    cy.button('submit').should('not.be.disabled')
  })

  it('Should keep the backend error while the user types', () => {
    cy.get('@email').type(TAKEN_EMAIL)
    cy.button('submit').click()
    cy.get('[data-testid="silent-error"]').should('exist')

    cy.get('@email').clear().type('ada@radicalbit.ai')

    cy.get('[data-testid="silent-error"]').should('contain.text', SILENT_ERROR)
  })

  it('Should clear the backend error when resubmitting with another email', () => {
    cy.get('@email').type(TAKEN_EMAIL)
    cy.button('submit').click()
    cy.get('[data-testid="silent-error"]').should('exist')

    cy.get('@email').clear().type('ada@radicalbit.ai')
    cy.button('submit').click()

    cy.get('[data-testid="silent-error"]').should('not.exist')
    cy.shouldSubmit({ email: 'ada@radicalbit.ai' })
  })
})
