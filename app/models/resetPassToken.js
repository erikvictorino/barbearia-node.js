import { DataTypes } from "sequelize";
import db from '../../config/database.js'
import Cliente from './Cliente.js'

const resetPass = db.define('resetPassToken', {
    token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expiresAt: {
        type: DataTypes.TIME,
        allowNull: false
    },
})

export default resetPass
