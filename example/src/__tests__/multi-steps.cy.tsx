import App from "../App"


describe('<MultiStepsForm />', () => {
    beforeEach(() => {
        cy.mount(<App />)
        cy.getTab('multi').click()

    })

    describe('<StepOne />', () => {
        it('Name input should exist', () => {
            cy.get('input').eq(0).should('exist')
        })

        it('Surname input should exist', () => {
            cy.get('input').eq(1).should('exist')
        })

        describe('<Actions />', () => {
            describe('Next', () => {
                beforeEach(() => {
                    cy.get('input').eq(0).as('name')
                    cy.get('input').eq(1).as('surname')
                })

                it('Next button should exist', () => {
                    cy.button('next').should('exist')
                })

                it('Should not submit form when not valid', () => {
                    cy.get('@name').type('Ada')
                    cy.button('next').click()

                    cy.shouldNotSubmit()
                })

                it('Should be submittable', () => {
                    cy.get('@name').type('Ada')
                    cy.get('@surname').type('Lovelace')

                    cy.button('next').click()

                    cy.get('input').eq(0).should('have.attr', 'placeholder', 'Age')
                })
            })

        })
    })


    describe('<StepTwo />', () => {
        beforeEach(() => {
            cy.get('input').eq(0).type('Ada')
            cy.get('input').eq(1).type('Lovelace')

            cy.button('next').click()
        })

        it('Age input should exist', () => {
            cy.get('input').eq(0).should('exist')
        })

        describe('<Actions />', () => {
            describe('Back', () => {
                it('Back button should exist', () => {
                    cy.button('prev').should('exist')
                })

                it('Back button should take to the prev form', () => {
                    cy.button('prev').click()

                    cy.get('input').eq(0).should('have.attr', 'placeholder', 'Name')

                    cy.button('next').click()
                })
            })

            describe('Next', () => {
                beforeEach(() => {
                    cy.get('input').eq(0).as('age')
                })

                it('Next button should exist', () => {
                    cy.button('next').should('exist')
                })

                it('Should not submit form when not valid', () => {
                    cy.get('@age').type('10')
                    cy.button('next').click()

                    cy.shouldNotSubmit()
                })

                it('Should be submittable', () => {
                    cy.get('@age').type('20')

                    cy.button('next').click()

                    cy.get('input').eq(0).should('have.attr', 'placeholder', 'Email')
                })
            })

        })
    })

    describe('<StepThree />', () => {
        beforeEach(() => {
            cy.get('input').eq(0).type('Ada')
            cy.get('input').eq(1).type('Lovelace')

            cy.button('next').click()

            cy.get('input').eq(0).type('20')

            cy.button('next').click()
        })

        it('Email input should exist', () => {
            cy.get('input').eq(0).should('exist')
        })

        describe('<Actions />', () => {
            describe('Reset', () => {
                it('Back button should exist', () => {
                    cy.button('reset').should('exist')
                })

                it('Back button should take to the prev form', () => {
                    cy.button('reset').click()

                    cy.get('input').eq(0).should('have.attr', 'placeholder', 'Name')
                })
            })

            describe('Submit', () => {
                beforeEach(() => {
                    cy.get('input').eq(0).as('email')
                })

                it('Next button should exist', () => {
                    cy.button('submit').should('exist')
                })

                it('Should not submit form when not valid', () => {
                    cy.get('@email').type('invalid-email')
                    cy.button('submit').click()

                    cy.shouldNotSubmit()
                })

                it('Should be submittable', () => {
                    cy.get('@email').type('ada@lovelace.com')

                    cy.button('submit').click()

                    cy.shouldSubmit({
                        name: 'Ada', surname: 'Lovelace', age: 20, email: 'ada@lovelace.com'
                    })
                })
            })

        })
    })
})