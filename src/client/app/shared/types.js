angular.module('tcApp2App')
    .factory('types', function () {

        var m = {}

        m.link = {
            entrevistado: {
                id: "entrevistado",
                name: "Entrevistado",
                obs: "Pessoa entrevistada",
                n1: "interview",
                n2: "person",
                fields: [
                    {
                        key: "n2",
                        type: 'ui-select-single',
                        templateOptions: {
                            label: 'Pessoa entrevistada no video',
                            optionsAttr: 'bs-options',
                            placeholder: 'Select option',
                            description: 'Template includes the allow-clear option on the ui-select-match element',
                            get options() {
                                return m.allNodes.type['person'].map(function (obj) {
                                    return obj.doc
                                })
                            },
                            valueProp: '_id',
                            labelProp: 'name',
                            required: true
                        }
                    },
                    { key: "obs", type: 'input', templateOptions: { label: 'Notas', required: true } }
                ]
            },
            entrevistador: {
                id: "entrevistador",
                name: "Entrevistador",
                obs: "Pessoa que entrevista",
                n1: "person",
                n2: "person",
                fields: [
                    { key: "obs", type: 'input', templateOptions: { label: 'Observasões' } }
                ]
            },
            locNas: {
                id: "locNas",
                name: "Local de nascimento",
                obs: "Lugar onde a pessoa nasceu",
                n1: "person",
                n2: "place",
                fields: [
                    { key: "obs", type: 'input', templateOptions: { label: 'Observasões' } }
                ]
            }
        }

        m.node = {
            person: {
                id: "person",
                name: "Pessoa",
                fields: [
                    {
                        key: 'name',
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
                        key: 'inicials',
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
                        key: 'notes',
                        type: 'textarea',
                        className: 'col-md-12',
                        templateOptions: {
                            type: 'text',
                            cols: 5,
                            label: 'Observações',
                            placeholder: 'Escrever aqui',
                            required: false
                        }
                    }
                ]
            }, place:
            {
                id: "place",
                name: "Lugar ou localidade",
                fields: [
                    {
                        key: 'name',
                        type: 'input',
                        className: 'col-md-12',
                        templateOptions: {
                            type: 'text',
                            label: 'Nome do lugar',
                            required: true
                        }
                    },
                    {
                        key: 'gps',
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
                        key: 'notes',
                        type: 'textarea',
                        className: 'col-md-12',
                        templateOptions: {
                            type: 'text',
                            cols: 5,
                            label: 'Observações',
                            placeholder: 'Escrever aqui',
                            required: false
                        }
                    }
                ]
            }, interview:
            {
                id: "interview",
                name: "Entrevista",
                fields: [
                    {
                        key: 'name',
                        type: 'input',
                        className: 'col-md-12',
                        templateOptions: {
                            type: 'text',
                            label: 'Nome do Entrevistado',
                            required: true
                        }
                    },
                    {
                        key: 'notes',
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

        m.nodeArr = Object.keys(m.node).map(function (key) { return m.node[key] })

        m.linkArr = Object.keys(m.link).map(function (key) { return m.link[key] })

        return m

    })
