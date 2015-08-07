//Build public assets

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: ['pkg'],
        commit: false,
        createTag: false,
        push: false
      }
    },
    handlebars: {
      compile: {
        options: {
          namespace: "App.templates"
        },
        files: {
          "public/templates/templates.js": "public/templates/*.handlebars"
        }
      }
    },
    uglify: {
      build: {
        options: {
          banner: '/*! \n' +
          '<%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> \n' +
          'Author: @fsrowe \n' +
          '*/\n',
          mangle: true,
          beautify: false,
          wrap: true
        },
        files: {
          'public/js/min/<%= pkg.name %>.min.js': [
            'public/data/*.js',
            'public/templates/templates.js',
            'public/js/models/*.js',
            'public/js/collections/*.js',
            'public/js/routers/*.js',
            'public/js/views/*.js',
            'public/js/*.js']
        }
      }
    },
    less: {
      production: {
        options: {
          compress: true
        },
        files: {
          "public/css/style.min.css": "public/css/style.less"
        }
      }
    },
    watch: {
      scripts: {
        files: ['public/js/*.js', 'public/js/models/*.js', 'public/js/routers/*.js', 'public/js/collections/*.js', 'public/js/views/*.js', 'public/js/lib/*.js'],
        tasks: ['bump', 'uglify'],
        options: {
          nospawn: true
        }
      },
      css: {
        files: ['public/css/*.less'],
        tasks: ['bump', 'less']
      },
      templates: {
        files: ['public/templates/*.handlebars'],
        tasks: ['bump', 'handlebars', 'uglify']
      }
    }
  });

  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-line-remover');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['bump', 'handlebars', 'uglify', 'less', 'watch']);
  grunt.registerTask('deploy', ['bump', 'handlebars', 'uglify', 'less']);
};
