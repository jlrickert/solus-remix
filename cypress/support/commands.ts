import faker from "@faker-js/faker";

declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Logs in with a random user. Yields the user and adds an alias to the user
             *
             * @returns {typeof login}
             * @memberof Chainable
             * @example
             *    cy.login()
             * @example
             *    cy.login({ email: 'whatever@example.com', nickname: 'whatever' })
             */
            login: typeof login;

            /**
             * Deletes the current @user
             *
             * @returns {typeof cleanupUser}
             * @memberof Chainable
             * @example
             *    cy.cleanupUser()
             * @example
             *    cy.cleanupUser({ email: 'whatever@example.com' })
             */
            cleanupUser: typeof cleanupUser;

            /**
             * Deletes all test users with "@example.com" in the name
             *
             * @returns {typeof cleanupUser}
             * @memberof Chainable
             * @example
             *    cy.cleanupUser()
             * @example
             *    cy.cleanupUser({ email: 'whatever@example.com' })
             */
            cleanupTestUserList: typeof cleanupTestUserList;
        }
    }
}

function login(
    input: Readonly<{
        email?: string;
        nickname?: string;
    }> = {}
) {
    const nickname = input.nickname ?? faker.name.firstName();
    const email =
        input.email ?? faker.internet.email(nickname, undefined, "example.com");
    cy.then(() => ({ email })).as("user");
    cy.exec(
        `npx ts-node --require tsconfig-paths/register ./cypress/support/create-user.ts "${email}"`
    ).then(({ stdout }) => {
        const cookieValue = stdout
            .replace(
                /.*<cookie>(?<cookieValue>.*)<\/cookie>.*/s,
                "$<cookieValue>"
            )
            .trim();
        cy.setCookie("__session", cookieValue);
    });
    return cy.get("@user");
}

function cleanupTestUserList() {
    cy.exec(
        `npx ts-node --require tsconfig-paths/register ./cypress/support/delete-test-user-list.ts`
    );
}

function cleanupUser({ email }: { email?: string } = {}) {
    if (email) {
        deleteUserByEmail(email);
    } else {
        cy.get("@user").then((user) => {
            const email = (user as { email?: string }).email;
            if (email) {
                deleteUserByEmail(email);
            }
        });
    }
    cy.clearCookie("__session");
}

function deleteUserByEmail(email: string) {
    cy.exec(
        `npx ts-node --require tsconfig-paths/register ./cypress/support/delete-user.ts "${email}"`
    );
    cy.clearCookie("__session");
}

Cypress.Commands.add("login", login);
Cypress.Commands.add("cleanupUser", cleanupUser);
Cypress.Commands.add("cleanupTestUserList", cleanupTestUserList);

/*
eslint
  @typescript-eslint/no-namespace: "off",
*/
