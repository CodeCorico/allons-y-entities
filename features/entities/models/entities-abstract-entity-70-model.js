'use strict';

module.exports = function() {
  DependencyInjection.model('$AbstractEntityModel', function() {

    return function $AbstractEntityModel(config) {
      var extend = require('extend'),
          befores = ['beforeCreate'];

      befores.forEach(function(beforeName) {
        if (config[beforeName]) {
          config[beforeName + 'Extend'] = config[beforeName];
          delete config[beforeName];
        }
      });

      return extend(true, {
        tableName: 'entities',
        connection: 'Entities',
        schema: false,
        migrate: 'safe',
        autoCreatedAt: false,
        autoUpdatedAt: false,
        attributes: {
          createdAt: {
            type: 'date',
            index: true
          },
          updatedAt: {
            type: 'date',
            index: true
          },
          entityType: {
            type: 'string',
            index: true
          },
          isSearchable: {
            type: 'boolean',
            index: true,
            defaultsTo: false
          },
          isSearchableAdvanced: {
            type: 'boolean',
            index: true,
            defaultsTo: false
          },
          search: {
            type: 'string',
            index: 'text',
            indexName: 'TextIndex',
            indexAttributes: ['search1', 'search2', 'search3'],
            indexWeights: {
              search1: 6,
              search2: 3,
              search3: 1
            }
          }
        },

        updateCriteria: function(criteria, entityType) {
          criteria = criteria || {};

          if (criteria.where) {
            criteria.where.entityType = entityType;
          }
          else {
            criteria.entityType = entityType;
          }

          return criteria;
        },

        beforeInit: function() {
          var _this = this,
              supers = ['find', 'count', 'findOne', 'findOrCreate'];

          supers.forEach(function(superName) {
            var superFunc = _this[superName];

            _this[superName] = function() {
              if (!arguments.length) {
                [].push.call(arguments, {});
              }
              arguments[0] = _this.updateCriteria(arguments[0], _this.entityType);

              return superFunc.apply(_this, arguments);
            };
          });
        },

        beforeCreate: function(values, callback) {
          values = values || {};

          values.entityType = this.entityType;
          values.isSearchable = this.isSearchable || false;
          values.isSearchableAdvanced = this.isSearchableAdvanced || false;
          values.createdAt = values.createdAt || new Date();

          if (this.beforeCreateExtend) {
            return this.beforeCreateExtend(values, callback);
          }

          callback(null, values);
        }
      }, config);

    };
  });
};
