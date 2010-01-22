#
# Simple script building task
#
# Copyright (C) 2010 Nikolay Nemshilov
#

require 'rake'
require 'fileutils'
require 'rubygems'
require 'front_compiler'

BUILD_DIR  = 'build/'
BUILD_NAME = 'kinda-player'

FILES_LIST = %w{
  kinda_player.js
  kinda_player/ui.js
  kinda_player/play.js
  kinda_player/events.js
  sound_manager.js
  document.js
}

CSS_FILES = %w{
  kinda_player.css
}

task :default => :build

task :build do
  
  puts " * Nuking the old build"
  
  FileUtils.rm_rf   BUILD_DIR
  FileUtils.mkdir_p BUILD_DIR
  
  puts " * Creating the new one"
  
  @header   = File.read("src/header.js")
  @compiler = FrontCompiler.new
  
  source = FILES_LIST.collect do |name|
    File.read("src/#{name}")
  end
  
  source = source + CSS_FILES.collect do |name|
    @compiler.inline_css(File.read("src/#{name}").gsub('../images', './images'))
  end
  
  source = source.join("\n\n\n")
  
  File.open("#{BUILD_DIR}/#{BUILD_NAME}.js", "w") do |file|
    file.write(@header + @compiler.compact_js(source).create_self_build)
  end
  
  File.open("#{BUILD_DIR}/#{BUILD_NAME}-min.js", "w") do |file|
    file.write(@header + @compiler.compact_js(source))
  end
  
  File.open("#{BUILD_DIR}/#{BUILD_NAME}-src.js", "w") do |file|
    file.write(@header + source)
  end
  
  puts " * Here you go!"
end