import App from '../App'

describe('<EditLikeForm />', () => {
  beforeEach(() => {
    cy.mount(<App />)
    cy.getTab('edit').click()
  })

  it('Name input should exist', () => {
    cy.get('input').eq(0).should('exist')
  })

  it('Surname input should exist', () => {
    cy.get('input').eq(1).should('exist')
  })

  it('Email input should exist', () => {
    cy.get('input').eq(2).should('exist')
  })

  it('Should render skeleton on render', () => {
    cy.get('.ant-skeleton-input').should('have.length', 3)
  })

  describe('<Actions />', () => {
    describe('Submit', () => {
      beforeEach(() => {
        cy.get('.ant-skeleton-input').should('not.exist')

        cy.get('input').eq(0).as('name')
        cy.get('input').eq(1).as('surname')
        cy.get('input').eq(2).as('email')
      })

      it('Submit button should exist', () => {
        cy.button('submit').should('exist')
      })

      it('Submit button should be disabled when form is rendered', () => {
        cy.button('submit').should('be.disabled')
      })

      it('Should be submittable', () => {
        cy.get('@name').clear().type('Harry')
        cy.get('@surname').clear().type('Potter')
        cy.get('@email').clear().type('harry@potter.com')

        cy.button('submit').click()

        cy.shouldSubmit({ name: 'Harry', surname: 'Potter', email: 'harry@potter.com' })
      })

      it('Should not submit form when not valid', () => {
        cy.get('@name').clear()
        cy.button('submit').click()

        cy.shouldNotSubmit()
      })
    })
  })
})

describe('<EditLikeForm /> when the fake API fails', () => {
  beforeEach(() => {
    // Force the failure the app otherwise triggers at random, so the error
    // and retry UI is actually covered instead of hit by chance.
    window.__fakeApiShouldFail = true

    cy.mount(<App />)
    cy.getTab('edit').click()
  })

  it('Should render the error UI', () => {
    cy.contains(':( Error').should('exist')
    cy.contains('Failed').should('exist')
    cy.get('input').should('not.exist')
  })

  it('Should render a Retry button', () => {
    cy.button('retry').should('exist')
  })

  it('Retry should recover once the API stops failing', () => {
    cy.button('retry').should('exist')

    cy.window().then((win) => {
      win.__fakeApiShouldFail = false
    })

    cy.button('retry').click()

    cy.get('.ant-skeleton-input').should('not.exist')
    cy.get('input').should('have.length.at.least', 3)
    cy.contains(':( Error').should('not.exist')
  })
})
