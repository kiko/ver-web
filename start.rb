require 'ramaze'
require 'compass'
require 'susy'

class CSS < Ramaze::Controller
  map '/css'
  provide :css, engine: :Sass, type: 'text/css'

  trait sass_options: {
    load_paths: [
      __DIR__('view/css'),
      Compass::Frameworks::ALL.map(&:stylesheets_directory)
    ].flatten!,
  }
end

class MainController < Ramaze::Controller
  map '/'
  set_layout :default
  engine :Haml
end

Ramaze.start :port => 7001, :adapter => :webrick, :mode => :dev
# ,:adaptor => :thin
# def screenshots
#   @shots = {
#     single: 'A Ruby source file in VER',
#     tiling: 'The tiling with three open buffers',
#     exception: 'Exception handling',
#     fuzzy_file_finder: 'Fuzzy file finder',
#     describe_key: 'Describe key bindings',
#     completion: 'Intelligent completion',
#   }
# end
