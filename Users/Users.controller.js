module.exports = {

  GetAll(db, req, res){
    db.query('SELECT * FROM users', (err, result) => {
      if (err) {
        res.json(error(err.message))
      } else {
        res.json(result)
      }
    })
  },

  GetOne(db, req, res){
    db.query('SELECT * FROM users WHERE username = ?', [req.body.username], (err, result) => {
        if (err) {
            res.json(err.message)
        } else {

            if (result[0] != undefined) {
                res.json({
                  Id: result[0].id,
                  Username: result[0].username
                })
            } else {
                res.json({error:'Pseudo Inexistant'})
            }

        }
    })
  },

  NewUser(db, req, res){
    if (req.body.username) {
      db.query('SELECT * FROM users WHERE username = ?', [req.body.username], (err, result) => {
        if (err) {
          res.json(err.message)
        } else {
          if (result[0] != undefined) {
            res.json('Pseudo déjà pris' )
          } else {
            db.query(`
              INSERT INTO users(id, username, password, email)
              VALUES(NULL, "${req.body.username}", "${req.body.password}", "${req.body.email}")`,
              (err, result) => {
              if (err) {
                res.json(err.message)
              } else {
                db.query('SELECT * FROM users WHERE username = ?', [req.body.username], (err, result) => {
                  if (err) {
                    res.json(err.message)
                  } else {
                    res.json({
                      id: result[0].id,
                      username: result[0].username
                    })
                  }
                })
              }
            })
          }
        }
      })
    } else {
        res.json('no name value')
    }
  },

  RemoveUser(db, req, res){
    db.query('SELECT * FROM users WHERE username = ?', [req.body.username], (err, result) => {
      if (err) {
        res.json(err.message)
      } else {
        if (result[0] != undefined) {
          db.query('DELETE FROM users WHERE username = ?', [req.body.username], (err, result) => {
            if (err) {
              res.json(err.message)
            } else {
              res.json(true)
            }
          })
        } else {
          res.json('Wrong username')
        }
      }
    })
  },

  UpdateUser(db, req, res){
    if (req.body.password && req.body.oldpassword) {
      db.query(`SELECT * FROM users WHERE username = "${req.body.username}" AND password = "${req.body.oldpassword}"`,(err, result) => {
        if (err) {
          res.json(err.message)
        } else {
          if (result[0] != undefined) {
            db.query(`SELECT * FROM users WHERE username = "${req.body.username}" AND password = "${req.body.password}"`, (err, result) => {
              if (err) {
                res.json(err.message)
              } else {
                if (result[0] != undefined) {
                  res.json('same password')
                } else {
                  db.query(`UPDATE users SET password = "${req.body.password}" WHERE username = "${req.body.username}"`,(err, result) => {
                    if (err) {
                      res.json(err.message)
                    } else {
                      res.json(true)
                    }
                  })
                }
              }
            })
          } else {
            res.json('Wrong id')
          }
        }
      })
    } else {
      res.json('no name value')
    }
  }
}
