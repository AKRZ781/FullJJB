import TechniqueModel from '../models/techniquesModel.js';


const TechniqueDAO = {
    findAll() {
        return  TechniqueModel.findAll();
    },
    findById(id) {
        return  TechniqueModel.findByPk(id);
    },
    createTechnique(title, description, videoUrl){
        return  TechniqueModel.create({ title, description, videoUrl });
    }
};

export default TechniqueDAO;