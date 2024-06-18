import App from "../App"


describe('<AddableFieldsForm />', () => {
    beforeEach(() => {
        cy.mount(<App />)
        cy.getTab('addable').click()

    })

    it('Name input should exist', () => {
        cy.get('input').eq(0).should('exist')
    })

    it('Surname input should exist', () => {
        cy.get('input').eq(1).should('exist')
    })

    it('Add Friend Name input should exist', () => {
        cy.get('input').eq(2).should('exist')
    })

    it('Add Friend Surname input should exist', () => {
        cy.get('input').eq(3).should('exist')
    })

    describe('<Actions />', () => {
        describe('Submit', () => {
            beforeEach(() => {
                cy.get('input').eq(0).as('name')
                cy.get('input').eq(1).as('surname')
                cy.get('input').eq(2).as('friendName')
                cy.get('input').eq(3).as('friendSurname')
            })

            it('Submit button should exist', () => {
                cy.button('submit').should('exist')
            })

            it('Submit button should be disabled when form is rendered', () => {
                cy.button('submit').should("be.disabled")
            })

            it('Should be submittable', () => {
                cy.get('@name').type('Harry')
                cy.get('@surname').type('Potter')
                cy.get('@friendName').type('Ron')
                cy.get('@friendSurname').type('Weasley')

                cy.get('.c-form-multiple__add').click()


                cy.button('submit').click()

                cy.shouldSubmit({ name: 'Harry', surname: 'Potter', friends: [{ name: 'Ron', surname: 'Weasley' }] })
            })

            it('Should not submit form when not valid', () => {
                cy.get('@name').type('Harry')
                cy.button('submit').click()

                cy.shouldNotSubmit()
            })
        })

        describe('Reset', () => {
            beforeEach(() => {
                cy.get('input').eq(0).as('name')
                cy.get('input').eq(1).as('surname')
                cy.get('input').eq(2).as('friendName')
                cy.get('input').eq(3).as('friendSurname')
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

                describe('<Friends />', () => {
                    beforeEach(() => {
                        cy.get('@friendName').type('Ron')
                        cy.get('@friendSurname').type('Weasley')

                        cy.get('.c-form-multiple__add').click()
                    })

                    it('Should reset friend name field', () => {
                        cy.button('reset').click()

                        cy.get('@friendName').should('be.empty')
                    })

                    it('Should reset friend surname field', () => {
                        cy.button('reset').click()

                        cy.get('@friendName').should('be.empty')
                    })
                })
            })
        })

    })

})