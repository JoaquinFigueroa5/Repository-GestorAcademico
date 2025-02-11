import moongose from 'moongose';

const RoleSchema = moongose.Schema({
    role: {
        type: String,
        required: [true, "El rol es obligatorio"]
    }
});

export default moongose.model('Role', RoleSchema);