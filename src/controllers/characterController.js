import Characters from "../models/Characters";
import Attributes from "../models/Attributes";
import User from "../models/User";

const createCharacter = async (req, res) => {
    try {
        const { user_id, name, class_id, race_id } = req.body;
        const character = await Characters.create({ user_id, name, class_id, race_id });

        const attributes = await Attributes.create({ character_id: character.id });

        await character.update({ attribute_id: attributes.id });

        return res.status(201).json({ character, attributes });
    } catch (err) {
        return res.status(500).json({ error: err });
    }
}

const getCharactersByUser = async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const characters = await Characters.findAll({ where: { user_id: user.id }, include: ['user', 'raca', 'attribute', 'class'] });

        return res.status(200).json({ characters });
    } catch (err) {
        return res.status(500).json({ error: err });
    }
}

export default { 
    createCharacter,
    getCharactersByUser 
};