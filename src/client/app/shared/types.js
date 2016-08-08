/* 
Estrutura de definição de elementos:

1. descritores:
    id
    name (nome que aparece nos menus)
    type ('main' ou 'secondary') - só os 'main' são acessiveis directamente

2. Formulários 
    newForm (formulário que a aparece quando se cria forma - obrigatório)
    viewForm (formulário que a aparece quando se visualisa - quando não definido = newForm)
    é possivel criar outros formulários

Regras de estilo
    O nº de campos a utilizar deve ser limitado a 3 ou 4. Em caso de extruturas complexas são criados tipos próprios do formy.
    Podem ser criados formulários tipos que são reutilizaveis (POR EXEMPLO, MAPA DE RELAÇÕES)



Tipos formly a pré-definir: 

    todos os elmentos pré-definidos recebem um modelo node, que depois é acedido a partir do controlador do tipos

    tipos genérios:

    1. link-table - tabela de relações do elemento, como elementos ligados e a ligar. 
        Premite associar e expandir as relações - Genérico, permite adicionar e apagar mas não editar links. 
        recebe lista de relações que poderão ser adicionadas

    2. link-select - campo simples onde se pode associar uma relação e notas ao lado. Pode ser aberto editável ou não. 
        a) Se não, é possivel editar com clique duplo ou botão, activando botão de gravar, que permite retomar modo visualização. Gravação é na BD.
        b) Se sim, o botão de gravar está invisivel (gravação na BD fica responsabilidade do controlador pai)

    2. link-multi-select - baseado no link-select, mas com botão para adicionar link-selects adicionais

Possivel já esteder
                extendForm: [{
                    form: 'viewForm',
                    withForm: 'newForm',
                    replaceToValues: [
                        { key: 'disabled', value: true }
                    ]
                }]


*/

angular.module('tcApp2App')
    .factory('types', function () {

        var m = {}

        typeDef = {
            person: {
                params: {
                    id: 'person',
                    name: "pessoa",
                    type: 'main'
                },
                forms: {
                    newForm: [
                        {
                            key: 'doc.name',
                            type: 'input',
                            className: 'col-md-12',
                            templateOptions: {
                                type: 'text',
                                label: 'Nome Completo',
                                placeholder: 'Introduzir o nome completo',
                                required: true
                            }
                        },
                        {
                            key: 'doc.notes',
                            type: 'textarea',
                            className: 'col-md-12',
                            templateOptions: {
                                type: 'text',
                                cols: 4,
                                label: 'Observações',
                                placeholder: 'Introduzir observações sobre a pessoa',
                                required: false
                            }
                        }],
                    viewForm: [
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
                extendForm: [{
                    form: 'viewForm',
                    withForm: 'newForm'
                }]
            },
            place: {
                params: {
                    id: 'place',
                    name: "Lugar",
                    type: 'main'
                },
                forms: {
                    newForm: [
                        {
                            key: 'doc.name',
                            type: 'input',
                            className: 'col-md-12',
                            templateOptions: {
                                type: 'text',
                                label: 'Nome do lugar',
                                placeholder: 'Introduzir o nome do lugar',
                                required: true
                            }
                        },
                        {
                            key: 'doc.notes',
                            type: 'textarea',
                            className: 'col-md-12',
                            templateOptions: {
                                type: 'text',
                                cols: 4,
                                label: 'Observações',
                                placeholder: 'Introduzir observações sobre o lugar',
                                required: false
                            }
                        }]
                },
                extendForm: [{
                    form: 'viewForm',
                    withForm: 'newForm',
                }]
            }
        }

        generateTypes = function (types) {
            var res = {}
            Object.keys(types).forEach(function (nodeType) {
                var myTypeDef = typeDef[nodeType]
                res[nodeType] = myTypeDef.params
                Object.keys(myTypeDef.forms).forEach(function (formId) {
                    res[nodeType][formId] = myTypeDef.forms[formId]
                })
                if (!myTypeDef.forms.viewForm) {
                    res[nodeType].viewForm = angular.copy(res[nodeType].newForm)
                } else {
                    myTypeDef.extendForm.forEach(function (extend) {
                        res[nodeType][extend.form] = angular.copy(res[nodeType][extend.withForm].concat(res[nodeType][extend.form]))
                        if (extend.replacetoValues) {
                            extend.replaceToValues.forEach(function (newVal) {
                                res[nodeType][extend.form].forEach(function (field) {
                                    field.templateOptions[newVal.key] = newVal.value
                                })
                            })
                        }
                    })
                }
            })

            return res
        }

        m.node = generateTypes(typeDef)


        m.oldNode = {
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



        return m

    })
