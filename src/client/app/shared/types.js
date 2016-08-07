angular.module('tcApp2App')
    .factory('types', function () {

        var m = {}

        m.links = {
            interview: [
                {
                    id: 'interviewed',
                    originNodeType: 'interview',
                    linkedNodeType: "person",
                    label: "Entrevistado",
                    description: "Selecione a pessoa que foi entrevistada",
                },
                {
                    id: 'entrevistador',
                    linkedNodeType: "person",
                    label: "Entrevistador",
                    description: "Selecione a pessoa que entrevistou",
                }
            ],
            person: [
                {
                    id: 'locNas',
                    linkedNodeType: "place",
                    label: "Local de nascimento",
                    description: "Selecione o local onde a pessoa nasceu",
                },
                {
                    id: 'datNas',
                    linkedNodeType: "event",
                    label: "data de nascimento",
                    description: "Selecione a data de nascimento da pessoa",
                },
            ]
        }


        m.node = {
            person: {
                id: "person",
                name: "Pessoa",
                mainFields: [
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
                        key: 'doc.birthDate',
                        type: 'datepicker',
                        className: 'col-md-2',
                        templateOptions: {
                            label: 'Data de nascimento',
                            type: 'text',
                            datepickerPopup: 'dd-MM-yyyy',
                            required: false
                        }
                    },
                    {
                        key: 'doc.notes',
                        type: 'textarea',
                        className: 'col-md-10',
                        templateOptions: {
                            type: 'text',
                            cols: 2,
                            label: 'Observações',
                            placeholder: 'Escrever aqui',
                            required: false
                        }
                    }],
                 relFields: [
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
                mainFields: [
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
                    }],
                 relFields: [
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
                editFields: [
                    {
                        isLink: true,
                        id: 'entrevistado',
                        originNodeType: 'interview',
                        linkedNodeType: "person",
                        label: "Entrevistado",
                        description: "Selecione a pessoa que foi entrevistada",
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
                    }],
                 relFields: [
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
            event: {
                id: "event",
                name: "Acontecimento",
                fields: [
                    {
                        key: 'doc.name',
                        type: 'input',
                        className: 'col-md-12',
                        templateOptions: {
                            type: 'text',
                            label: 'Titulo do Acontecimento',
                            required: true
                        }
                    },
                    {
                        key: 'doc.date',
                        type: 'datepicker',
                        className: 'col-md-12',
                        templateOptions: {
                            label: 'Data do acontecimento',
                            type: 'text',
                            datepickerPopup: 'dd-MMMM-yyyy',
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
                    }],
                 relFields: [
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
