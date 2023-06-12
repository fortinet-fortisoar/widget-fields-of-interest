'use strict';
(function () {
    angular
        .module('cybersponse')
        .controller('editFieldsOfInterest101Ctrl', editFieldsOfInterest101Ctrl);

    editFieldsOfInterest101Ctrl.$inject = ['$scope', '$uibModalInstance', 'config', '_', '$state', 'Entity', 'widget', 'ViewTemplateService', 'CommonUtils'];

    function editFieldsOfInterest101Ctrl($scope, $uibModalInstance, config, _, $state, Entity,  widget, ViewTemplateService, CommonUtils) {
        $scope.cancel = cancel;
        $scope.save = save;
        $scope.widget = widget;
        $scope.config = config;
        $scope.config.hideEmptyFieldsCheckbox = !CommonUtils.isUndefined($scope.config.hideEmptyFieldsCheckbox) ? $scope.config.hideEmptyFieldsCheckbox : true;
        $scope.config.rows = $scope.config.rows || [{
            columns: [{
                fields: []
            }],
            style : ''
        }];

        $scope.config.excludeFieldsArray = $scope.config.excludeFieldsArray ? $scope.config.excludeFieldsArray : [];
        $scope.changeStructure = changeStructure;
        $scope.alwaysUseEdit = ['checkbox', 'lookup', 'picklist', 'datetime'];
        $scope.fieldNotExists = fieldNotExists;
        $scope.addField = addField;
        $scope.removeField = removeField;
        if($scope.config.hideEmptyFields === undefined){
            $scope.config.hideEmptyFields = true;
        }
        
        $scope.config.includeAll = $scope.config.includeAll ? $scope.config.includeAll : false;


        $scope.module = $state.params.module;
        $scope.applyDefaults = applyDefaults;
        $scope.config.allReadOnly = false;
        $scope.config.allHighlightMode = true;
        checkReadOnlyAndAllHighlight();
        loadAttributes();


        function applyDefaults(attribute, value) {
            angular.forEach($scope.config.rows, function(row) {
              angular.forEach(row.columns, function(column) {
                angular.forEach(column.fields, function(field) {
                  if (attribute === 'highlightMode' && $scope.alwaysUseEdit.indexOf($scope.fields[field.name].type) > -1) {
                    return;
                  }
                  field[attribute] = value;
                });
              });
            });
        }

        function checkReadOnlyAndAllHighlight() {
            angular.forEach($scope.config.rows, function(row) {
              angular.forEach(row.columns, function(column) {
                var fields = [];
                angular.forEach(column.fields, function(field) {
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
                column.fields = fields;
              });
            });
          }

        function removeField(index, column) {
            column.fields.splice(index, 1);
            checkReadOnlyAndAllHighlight();
        }

        function fieldNotExists(field) {
            var fields = _.flatten(_.pluck($scope.config.rows[0].columns, 'fields'));
            var fieldNames = _.pluck(fields, 'name');
            return fieldNames.indexOf(field.name) === -1;
        }

        function addField(newField) {
            for (var index = 0; index < $scope.fieldsArray.length; index++) {
                if ($scope.fieldsArray && $scope.fieldsArray[index].type === 'object' && $scope.fieldsArray[index].name === newField) {
                    $scope.config.rows[0].columns[0].fields.push({
                        name: newField,
                        renderWidget: 'json',
                        renderWidgetHeight: 250,
                        readOnly:true,
                        highlightMode: true
                    });
                    break;
                } else {
                    $scope.config.rows[0].columns[0].fields.push({
                        name: newField,
                        readOnly:true,
                        highlightMode: true
                    });
                    break;
                }
            }
            checkReadOnlyAndAllHighlight();
        }

        function changeStructure(structure) {
            structure = structure || 1;
            var currentColumns = angular.copy($scope.config.rows[0].columns);
            var newColumns = ViewTemplateService.changeStructure(structure, currentColumns, 'fields');

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
