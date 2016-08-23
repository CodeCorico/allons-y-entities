'use strict';

module.exports = function() {
  DependencyInjection.model('EntityModel', function($AbstractModel) {

    return $AbstractModel('EntityModel', function() {

      return {
        identity: 'entities',
        connection: 'Entities',
        schema: false,
        migrate: 'safe',
        autoCreatedAt: false,
        autoUpdatedAt: false,
        attributes: {},

        registerSearchPublicData: function(type, owner, func) {
          this[type + 'SearchPublicData'] = function(entity, $socket, regex) {
            var newEntity = func.call(owner, entity, $socket, regex);

            if (!newEntity) {
              return newEntity;
            }

            newEntity.entityType = entity.entityType;
            newEntity.score = entity.score;

            return newEntity;
          };
        }
      };

    });

  });

  return 'EntityModel';
};
