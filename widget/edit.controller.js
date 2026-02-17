
/* Copyright start
    MIT License
    Copyright (c) 2026 Fortinet Inc
Copyright end */

'use strict';
(function () {
    angular
        .module('cybersponse')
        .controller('editFieldsOfInterest110Ctrl', editFieldsOfInterest110Ctrl);

    editFieldsOfInterest110Ctrl.$inject = ['$scope', 'widgetUtilityService', '$uibModalInstance', 'config', '_', '$state', 'Entity', 'widget', 'ViewTemplateService', 'CommonUtils', 'viewTemplate'];

    function editFieldsOfInterest110Ctrl($scope, widgetUtilityService, $uibModalInstance, config, _, $state, Entity, widget, ViewTemplateService, CommonUtils, viewTemplate) {
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

        function _handleTranslations() {
            let widgetNameVersion = widgetUtilityService.getWidgetNameVersion($scope.$resolve.widget, $scope.$resolve.widgetBasePath);
            if (widgetNameVersion) {
                widgetUtilityService.checkTranslationMode(widgetNameVersion).then(function () {
                    $scope.viewWidgetVars = {
                        // Create your translating static string variables here
                        ADD_SECTION: widgetUtilityService.translate('fieldsOfInterest.ADD_SECTION'),
                        ALL_INLINE: widgetUtilityService.translate('fieldsOfInterest.ALL_INLINE'),
                        ALL_INLINE_TOOLTIP: widgetUtilityService.translate('fieldsOfInterest.ALL_INLINE_TOOLTIP'),
                        ALL_READ_ONLY: widgetUtilityService.translate('fieldsOfInterest.ALL_READ_ONLY'),
                        CLOSE_BTN: widgetUtilityService.translate('fieldsOfInterest.CLOSE_BTN'),
                        CUSTOM_HTML: widgetUtilityService.translate('fieldsOfInterest.CUSTOM_HTML'),
                        CUSTOM_VIEW: widgetUtilityService.translate('fieldsOfInterest.CUSTOM_VIEW'),
                        CUSTOM_WIDGET: widgetUtilityService.translate('fieldsOfInterest.CUSTOM_WIDGET'),
                        EDIT_TITLE: widgetUtilityService.translate('fieldsOfInterest.EDIT_TITLE'),
                        EXCLUDE_FIELDS: widgetUtilityService.translate('fieldsOfInterest.EXCLUDE_FIELDS'),
                        HTML: widgetUtilityService.translate('fieldsOfInterest.HTML'),
                        HTML_PLACEHOLDER: widgetUtilityService.translate('fieldsOfInterest.HTML_PLACEHOLDER'),
                        INLINE_EDITOR: widgetUtilityService.translate('fieldsOfInterest.INLINE_EDITOR'),
                        INLINE_EDITOR_TOOLTIP: widgetUtilityService.translate('fieldsOfInterest.INLINE_EDITOR_TOOLTIP'),
                        IS_JSON: widgetUtilityService.translate('fieldsOfInterest.IS_JSON'),
                        READ_ONLY: widgetUtilityService.translate('fieldsOfInterest.READ_ONLY'),
                        READ_ONLY_TOOLTIP: widgetUtilityService.translate('fieldsOfInterest.READ_ONLY_TOOLTIP'),
                        SAVE_BTN: widgetUtilityService.translate('fieldsOfInterest.SAVE_BTN'),
                        SELECT_A_WIDGET: widgetUtilityService.translate('fieldsOfInterest.SELECT_A_WIDGET'),
                        SELECT_WIDGET: widgetUtilityService.translate('fieldsOfInterest.SELECT_WIDGET'),
                        SHOW_ALL_FIELDS: widgetUtilityService.translate('fieldsOfInterest.SHOW_ALL_FIELDS'),
                        SHOW_FIELDS: widgetUtilityService.translate('fieldsOfInterest.SHOW_FIELDS'),
                        SHOW_FIELDS_TOOLTIP: widgetUtilityService.translate('fieldsOfInterest.SHOW_FIELDS_TOOLTIP'),
                        TITLE: widgetUtilityService.translate('fieldsOfInterest.TITLE'),
                        TITLE_TOOLTIP: widgetUtilityService.translate('fieldsOfInterest.TITLE_TOOLTIP'),
                        TOOLTIP: widgetUtilityService.translate('fieldsOfInterest.TOOLTIP'),
                        TOOLTIP_TOOLTIP: widgetUtilityService.translate('fieldsOfInterest.TOOLTIP_TOOLTIP'),
                        WIDGET_EDIT_TITLE: widgetUtilityService.translate('fieldsOfInterest.WIDGET_EDIT_TITLE'),
                        WIDGET_HEIGHT: widgetUtilityService.translate('fieldsOfInterest.WIDGET_HEIGHT'),
                        WIDGET_HEIGHT_TOOLTIP: widgetUtilityService.translate('fieldsOfInterest.WIDGET_HEIGHT_TOOLTIP')
                    }
                    $scope.header = $scope.config.title ? 'Edit widget' : 'Add widget';
                    loadAttributes();
                });
            } else {
                $timeout(function () {
                    $scope.cancel();
                });
            }
        }

        init();

        function init() {
            // To handle backward compatibility for widget
            _handleTranslations();
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
