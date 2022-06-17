// Use this to delete a user by their email
// Simply call this with:
// npx ts-node --require tsconfig-paths/register ./cypress/support/remove-test-user-list
// and that user will get deleted

import { installGlobals } from "@remix-run/node/globals";
import { deleteAllTestUsers } from "~/models/User.server";
import { forceRun } from "~/vendor/Prisma";

installGlobals();

async function removeTestUserList() {
    await forceRun(deleteAllTestUsers());
}

removeTestUserList();
