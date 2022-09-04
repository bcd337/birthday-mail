const connection = require('../database/mysql')
const sendEmail = require('../tools/sendEmail')

async function getUser(hour) {
  const [rows] = await connection.query(`
    SELECT
      id,
      email,
      first_name,
      last_name,
      birthday, 
      timezone
    FROM user
    where DATE_FORMAT(CONVERT_TZ(current_timestamp, @@session.time_zone, timezone), "%m-%d") = DATE_FORMAT(birthday, "%m-%d")
    and DATE_FORMAT(CONVERT_TZ(current_timestamp, @@session.time_zone, timezone), "%k") >= ?
    and (
      select count(id)
      from mail_birthday
      where user_id = user.id
      and mail_birthday.date >= current_date()
      and (mail_birthday.status = 1 or mail_birthday.status = 2)
    ) = 0
  `, [hour])

  return rows
}

function sendMail({ id, email, message }) {
  connection
    .execute(`INSERT INTO mail_birthday (user_id, status) VALUES (:userId, 2)`, { userId: id })
    .then(([results]) => {
      const logId = results.insertId
      sendEmail(email, message)
        .then(() => {
          connection.execute(
            `UPDATE mail_birthday SET status = 1 WHERE (id = :id)`,
            { id: logId }
          )
        }) 
        .catch(() => {
          connection.execute(
            `UPDATE mail_birthday SET status = 0 WHERE (id = :id)`, 
            { id: logId }
          )
        })
    })
}

async function sendEmailBirthday() {
  const hour = 9
  const users = await getUser(hour)

  users.forEach(({ id, email, first_name, last_name }) => {
    const message = `“Hey, ${first_name} ${last_name} it's your birthday.`
    sendMail({ id, email, message })
  })
}

module.exports = sendEmailBirthday