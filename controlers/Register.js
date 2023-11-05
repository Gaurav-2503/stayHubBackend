


app.post( "/register", [
                        body("name", "Enter a Valid Name").isLength({ min: 3 }),
                        body("email", "Enter a Valid E-mail").isEmail(),
                        body("password", "Password must be at least 5 characters").isLength({
                        min: 5,
                        }),
                    ],  

    async (req, res) => {

        try {
        const { name, email, password } = req.body;

        const newUser = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, secretSalt),
        });

        console.log(newUser);

        res.json(newUser);
        } catch (e) {
        console.log("Error happened ", e);
        res.status(422).json(e);
        }
  }
);
