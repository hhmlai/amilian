angular.module('tcApp2App')
    .factory('types', function (model) {

        var m = {}

        links = {
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

        generateLinkTypes = function (links) {
            var res = {}
            angular.forEach(links, function (nodeLinks, nodeTypeId) {
                res[nodeTypeId] = []
                angular.forEach(nodeLinks, function (link) {
                    res[nodeTypeId].push({
                        id: link.id,
                        n1: nodeTypeId,
                        n2: link.linkedNode.id,
                        name: link.linkedNode.label,
                        fields: [
                            {
                                key: "n2",
                                type: 'ui-select-single',
                                templateOptions: {
                                    label: link.linkedNode.label,
                                    optionsAttr: 'bs-options',
                                    description: link.linkedNode.description,
                                    get options() {
                                        return model.all.type[link.linkedNode.id].map(function (obj) {
                                            return obj.doc
                                        })
                                    },
                                    valueProp: 'id',
                                    labelProp: 'name',
                                    required: true
                                }
                            },
                            { key: "obs", type: 'input', templateOptions: { label: 'Notas' } }
                        ]

                    })
                }
                )
            })
            return res
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

        m.link = generateLinkTypes(links)
    console.log(m.link)

        return m

    })
