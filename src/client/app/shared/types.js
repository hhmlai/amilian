angular.module('tcApp2App')
    .factory('types', function () {

        var m = {}

        m.links = {
            interview: [
                {
                    id: 'entrevistado',
                    linkedNode: {
                        id: "person",
                        label: "Entrevistado",
                        description: "Selecione a pessoa que foi entrevistada",
                    }
                },
                {
                    id: 'entrevistador',
                    linkedNode: {
                        id: "person",
                        label: "Entrevistador",
                        description: "Selecione a pessoa que entrevistou",
                    },
                }],
            person: [
                {
                    id: 'locNas',
                    linkedNode: {
                        id: "place",
                        label: "Local de nascimento",
                        description: "Selecione o local onde a pessoa nasceu",
                    },
                    unique: true
                }]
        }


        m.node = {
            person: {
                id: "person",
                name: "Pessoa",
                fields: [
                    {
                        key: 'doc.name',
                        type: 'input',
                        className: 'col-md-12',
                        templateOptions: {
                            type: 'text',
                            label: 'Nome Completo',
                            placeholder: 'Enter your name',
                            required: true
                        }
                    },
                    {
                        key: 'doc.inicials',
                        type: 'input',
                        className: 'col-md-6',
                        templateOptions: {
                            type: 'text',
                            label: 'Iniciais',
                            placeholder: 'Entrar as iniciais',
                            required: true
                        }
                    },
                    {
                        key: 'doc.notes',
                        type: 'textarea',
                        className: 'col-md-12',
                        templateOptions: {
                            type: 'text',
                            cols: 5,
                            label: 'Observações',
                            placeholder: 'Escrever aqui',
                            required: false
                        }
                    },
                    {
                        key: 'links',
                        type: 'link-table',
                        className: 'col-md-12',
                        templateOptions: {
                            required: false
                        }
                    }
                ]
            },
            place: {
                id: "place",
                name: "Lugar ou localidade",
                fields: [
                    {
                        key: 'doc.name',
                        type: 'input',
                        className: 'col-md-12',
                        templateOptions: {
                            type: 'text',
                            label: 'Nome do lugar',
                            required: true
                        }
                    },
                    {
                        key: 'doc.gps',
                        type: 'input',
                        className: 'col-md-6',
                        templateOptions: {
                            type: 'text',
                            label: 'Coordenadas GPS',
                            placeholder: 'Entrar coordenadas GPS',
                            required: true
                        }
                    },
                    {
                        key: 'doc.notes',
                        type: 'textarea',
                        className: 'col-md-12',
                        templateOptions: {
                            type: 'text',
                            cols: 5,
                            label: 'Observações',
                            placeholder: 'Escrever aqui',
                            required: false
                        }
                    },
                    {
                        key: 'links',
                        type: 'link-table',
                        className: 'col-md-12',
                        templateOptions: {
                            required: false
                        }
                    }
                ]
            }, 
            interview: {
                id: "interview",
                name: "Entrevista",
                fields: [
                    {
                        key: 'doc.name',
                        type: 'input',
                        className: 'col-md-12',
                        templateOptions: {
                            type: 'text',
                            label: 'Nome do Entrevistado',
                            required: true
                        }
                    },
                    {
                        key: 'doc.notes',
                        type: 'textarea',
                        className: 'col-md-12',
                        templateOptions: {
                            type: 'text',
                            cols: 5,
                            label: 'Observações',
                            placeholder: 'Escrever aqui',
                            required: false
                        }
                    },
                    {
                        key: 'links',
                        type: 'link-table',
                        className: 'col-md-12',
                        templateOptions: {
                            required: false
                        }
                    }
                ]
            }
        }

        return m

    })
