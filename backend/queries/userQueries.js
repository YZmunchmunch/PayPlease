const db = require("../db");

async function getUserById(user_id) {
    try {
        const user = await db.query(
            'SELECT * FROM wallet.users WHERE user_id = $1', 
            [user_id]);
        return user.rows[0];
    } catch (error) {
        console.log("Database Error: Error getting user by id");
        throw Error(error.message);
    }
}

async function getUsernameFromWalletId(wallet_id) {
    try {
        // Query the wallet.wallets table to get the user_id
        const userResult = await db.query(
            'SELECT user_id FROM wallet.wallets WHERE wallet_id = $1',
            [wallet_id]
        );
        if (userResult.rows.length === 0) {
            // Handle the case where wallet_id is not found
            return null;
        }
        const user_id = userResult.rows[0].user_id;
        // Query the wallet.users table to get the username
        const usernameResult = await db.query(
            'SELECT username FROM wallet.users WHERE user_id = $1',
            [user_id]
        );
        if (usernameResult.rows.length === 0) {
            // Handle the case where user_id is not found (unlikely if your database is properly structured)
            return null;
        }
        const username = usernameResult.rows[0].username;

        return username;
    } catch (error) {
        console.error("Error getting username from wallet_id:", error);
        throw Error(error.message);
    }
}

async function getUserByUsername(username) {
    try {
        const user = await db.query(
            'SELECT * FROM wallet.users WHERE username = $1', 
            [username]);
        return user.rows[0];
    } catch (error) {
        console.log("Database Error: Error getting user by username");
        throw Error(error.message);
    }
}

// Function to fetch user by email
async function getUserByEmail(email) {
    try {
        const user = await db.query('SELECT * FROM wallet.users WHERE email = $1', [email]);
        return user.rows[0];
    } catch (error) {
        console.log("Database Error: Error getting user by email");
        throw Error(error.message);
    }
}

async function getUserByPhone(phone_number) {
    try {
        const user = await db.query(
            'SELECT * FROM wallet.users WHERE phone_number = $1', 
            [phone_number]);
        return user.rows[0];
    } catch (error) {
        console.log("Database Error: Error getting user by phone");
        throw Error(error.message);
    }
}

async function getUserByParam(param) {
    try {
        const user = await db.query(
            'SELECT * FROM wallet.users WHERE username = $1 OR email = $1 OR phone_number = $1', 
            [param]
        );
        if (user.rows.length === 0) {
            throw new Error("User does not exist.");
        }
        return user.rows[0];
    } catch (error) {
        console.error("Database Error:", error.message);
        throw error;
    }
}

async function isEmailTaken(email) {
    return new Promise((resolve, reject) => {
        db.query('SELECT email FROM wallet.users WHERE email = $1', [email], async (error, results) => {
            if (error) {
                console.error(error);
                reject(error);
            } else {
                resolve(results.rows.lenth > 0);
            }
        })
    });
}

async function insertUser(user) {
    try {
        await db.query(
            'INSERT INTO wallet.users (user_id, username, email, hashed_pw, phone_number, account_type) VALUES ($1, $2, $3, $4, $5, $6)', 
            [user.user_id, user.username, user.email, user.hashedPassword, user.phone, user.account_type]);
    } catch (error) {
        console.log("Database Error: Error inserting user");
        throw Error(error.message);
    }
}


module.exports = {
    getUserById,
    getUserByUsername,
    getUserByEmail,
    getUserByPhone,
    getUserByParam,
    getUsernameFromWalletId,
    isEmailTaken,
    insertUser,
}
