
/* Copyright start
    MIT License
    Copyright (c) 2026 Fortinet Inc
Copyright end */

'use strict';
(function () {
    angular
        .module('cybersponse')
        .controller('editFieldsOfInterest110Ctrl', editFieldsOfInterest110Ctrl);

    editFieldsOfInterest110Ctrl.$inject = ['$scope', '$uibModalInstance', 'config', '_', '$state', 'Entity', 'widget', 'ViewTemplateService', 'CommonUtils', 'viewTemplate'];

    function editFieldsOfInterest110Ctrl($scope, $uibModalInstance, config, _, $state, Entity, widget, ViewTemplateService, CommonUtils, viewTemplate) {
        $scope.cancel = cancel;
        $scope.save = save;
        $scope.widget = widget;
        $scope.config = config;
        $scope.config.hideEmptyFieldsCheckbox = !CommonUtils.isUndefined($scope.config.hideEmptyFieldsCheckbox) ? $scope.config.hideEmptyFieldsCheckbox : true;
        $scope.config.rows = $scope.config.rows || [{
            columns: [
                {
                    sections: [
                        {
                            fields: []
                        }
                    ]
                }
            ]
        }];

        $scope.config.excludeFieldsArray = $scope.config.excludeFieldsArray ? $scope.config.excludeFieldsArray.map(({ title, name }) => ({ title, name })) : [];
        $scope.changeStructure = changeStructure;
        $scope.alwaysUseEdit = ['checkbox', 'lookup', 'picklist', 'datetime'];
        $scope.alreadyExcludedFields = alreadyExcludedFields;
        $scope.addField = addField;
        $scope.addSection = addSection;
        $scope.removeField = removeField;
        $scope.removeSection = removeSection;
        $scope.updatetJsonField = updatetJsonField;
        if ($scope.config.hideEmptyFields === undefined) {
            $scope.config.hideEmptyFields = true;
        }

        $scope.config.includeAll = $scope.config.includeAll ? $scope.config.includeAll : false;


        $scope.module = $state.params.module;
        $scope.applyDefaults = applyDefaults;
        $scope.config.allReadOnly = true;
        $scope.config.allHighlightMode = true;
        checkReadOnlyAndAllHighlight();
        $scope.widgets = Object.values(viewTemplate.widgets);
        $scope.fieldNotExists = fieldNotExists;

        init();

        function init() {
            loadAttributes();
        }

        function applyDefaults(attribute, value) {
            angular.forEach($scope.config.rows, function (row) {
                angular.forEach(row.columns, function (column) {
                    angular.forEach(row.sections, function (section) {
                        angular.forEach(section.fields, function (field) {
                            if (attribute === 'highlightMode' && $scope.alwaysUseEdit.indexOf($scope.fields[field.name].type) > -1) {
                                return;
                            }
                            field[attribute] = value;
                        });
                    });
                });
            });
        }

        function checkReadOnlyAndAllHighlight() {
            angular.forEach($scope.config.rows, function (row) {
                angular.forEach(row.columns, function (column) {
                    angular.forEach(column.sections, function (section) {
                        var fields = [];
                        angular.forEach(section.fields, function (field) {
                            if (angular.isObject(field)) {
                                $scope.config.allReadOnly = $scope.config.allReadOnly && field.readOnly;
                                $scope.config.allHighlightMode = $scope.config.allHighlightMode && field.highlightMode;
                                fields.push(field);
                            } else {
                                fields.push({
                                    name: field,
                                    highlightMode: true,
                                    readOnly: false
                                });
                            }
                        });
                        section.fields = fields;
                    });
                });
            });
        }

        function removeField(index, section) {
            section.fields.splice(index, 1);
            checkReadOnlyAndAllHighlight();
        }

        function removeSection(index, column) {
            column.sections.splice(index, 1);
        }

        function fieldNotExists(fieldToCheck) {
            var exists = false;
            angular.forEach($scope.config.rows, function (row) {
                angular.forEach(row.columns, function (column) {
                    angular.forEach(column.sections, function (section) {
                        angular.forEach(section.fields, function (f) {
                            var name = angular.isObject(f) ? f.name : f;
                            if (name === fieldToCheck.name) {
                                exists = true;
                            }
                        });
                    });
                });
            });
            return !exists;
        }

        function alreadyExcludedFields(field) {
            var fieldNames = _.pluck($scope.config.excludeFieldsArray, 'name');
            return fieldNames.indexOf(field.name) === -1;
        }

        function updatetJsonField(field) {
            if (!field.isJsonField) {
                field.title = '';
                field.propertyPath = '';
            }
            if (field.isCustomView) {
                field.customViewFormat = 'custom-html';
            } else {
                field.customViewFormat = undefined;
            }

        }

        function addField(newField) {
            for (var index = 0; index < $scope.fieldsArray.length; index++) {
                if ($scope.fieldsArray && $scope.fieldsArray[index].type === 'object' && $scope.fieldsArray[index].name === newField) {
                    $scope.config.rows[0].columns[0].sections[0].fields.push({
                        name: newField,
                        renderWidget: 'json',
                        renderWidgetHeight: 250,
                        readOnly: true,
                        highlightMode: true
                    });
                    break;
                } else {
                    $scope.config.rows[0].columns[0].sections[0].fields.push({
                        name: newField,
                        readOnly: true,
                        highlightMode: true
                    });
                    break;
                }
            }
            checkReadOnlyAndAllHighlight();
        }

        function addSection(column) {
            column.sections.push({ fields: [] });
        }

        function changeStructure(structure) {
            structure = structure || 1;
            var currentColumns = angular.copy($scope.config.rows[0].columns);
            var newColumns = ViewTemplateService.changeStructure(structure, currentColumns, 'fields', true);

            $scope.config.rows[0].columns = newColumns;
        }


        function loadAttributes() {
            var entity = new Entity($scope.module);
            entity.loadFields().then(function () {
                $scope.fields = entity.getFormFields();
                $scope.fieldsArray = _.values($scope.fields);
            });
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function save() {
            if ($scope.editFieldsOfInterestForm.$invalid) {
                $scope.editFieldsOfInterestForm.$setTouched();
                $scope.editFieldsOfInterestForm.$focusOnFirstError();
                return;
            }

            $uibModalInstance.close($scope.config);
        }

    }
})();
