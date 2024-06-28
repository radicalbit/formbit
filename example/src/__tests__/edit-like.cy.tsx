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
