import faker from "@faker-js/faker";

describe("smoke tests", () => {
    beforeEach(() => {
        cy.cleanupTestUserList();
    });
    afterEach(() => {
        cy.cleanupUser();
    });

    it("should allow you to register and login", () => {
        const loginForm = {
            email: `${faker.internet.userName()}@example.com`,
            nickname: `${faker.internet.userName()}`,
            password: faker.internet.password(),
        };
        cy.then(() => ({ email: loginForm.email })).as("user");

        cy.visit("/");
        cy.findByRole("link", { name: /PLAY FREE/i }).click();

        cy.findByRole("textbox", { name: /nickname/i }).type(
            loginForm.nickname
        );
        cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
        cy.findByLabelText(/password/i).type(loginForm.password);
        cy.findByRole("button", { name: /create account/i }).click();

        cy.visit("/");

        // cy.findByRole("link", { name: /notes/i }).click();
        cy.findByRole("button", { name: /open user menu/i }).click();
        cy.findByRole("button", { name: /Log out/i }).click();
        cy.findByRole("link", { name: /PLAY FREE/i });
    });

    it("should allow you to make a note", () => {
        const testNote = {
            title: faker.lorem.words(1),
            body: faker.lorem.sentences(1),
        };
        cy.login();
        cy.visit("/notes");

        cy.findByText("No notes yet");

        cy.findByRole("link", { name: /\+ new note/i }).click();

        cy.findByRole("textbox", { name: /title/i }).type(testNote.title);
        cy.findByRole("textbox", { name: /body/i }).type(testNote.body);
        cy.findByRole("button", { name: /save/i }).click();

        cy.findByRole("button", { name: /delete/i }).click();

        cy.findByText("No notes yet");
    });
});
