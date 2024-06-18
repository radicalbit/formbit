import App from "../App"


describe('<BasicFormHook />', () => {
    beforeEach(() => {
        cy.mount(<App />)
        cy.getTab('context').click()

    })

    it('Name input should exist', () => {
        cy.get('input').eq(0).should('exist')
    })

    it('Surname input should exist', () => {
        cy.get('input').eq(1).should('exist')
    })

    it('Age input should exist', () => {
        cy.get('input').eq(2).should('exist')
    })

    describe('<Actions />', () => {
        describe('Submit', () => {
            beforeEach(() => {
                cy.get('input').eq(0).as('name')
                cy.get('input').eq(1).as('surname')
                cy.get('input').eq(2).as('age')
            })

            it('Submit button should exist', () => {
                cy.button('submit').should('exist')
            })

            it('Submit button should be disabled when form is rendered', () => {
                cy.button('submit').should("be.disabled")
            })

            it('Should be submittable', () => {
                cy.get('@name').type('Ada')
                cy.get('@surname').type('Lovelace')
                cy.get('@age').type('20')

                cy.button('submit').click()

                cy.shouldSubmit({ name: 'Ada', surname: 'Lovelace', age: 20 })
            })

            it('Should not submit form when not valid', () => {
                cy.get('@name').type('Ada')
                cy.button('submit').click()

                cy.shouldNotSubmit()
            })
        })

        describe('Reset', () => {
            beforeEach(() => {
                cy.get('input').eq(0).as('name')
                cy.get('input').eq(1).as('surname')
                cy.get('input').eq(2).as('age')
            })

            it('Reset button should exist', () => {
                cy.button('reset').should('exist')
            })

            describe('Can be reset to original state', () => {
                it('Should reset name field', () => {
                    cy.get('@name').type('Ada')
                    cy.button('reset').click()

                    cy.get('@name').should('be.empty')
                })

                it('Should reset surname field', () => {
                    cy.get('@surname').type('Lovelace')
                    cy.button('reset').click()

                    cy.get('@surname').should('be.empty')
                })

                it('Should reset age field', () => {
                    cy.get('@age').type('20')
                    cy.button('reset').click()

                    cy.get('@age').should('be.empty')
                })
            })
        })
    })


})