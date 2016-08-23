'use strict';

module.exports = function($AbstractModel, $config, $AbstractEntityModel) {
  if ($config.entities) {
    $config = $AbstractEntityModel.call($AbstractModel, $config);
  }

  return $config;
};
