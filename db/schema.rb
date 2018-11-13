# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20181113022957) do

  create_table "access_logs", force: :cascade do |t|
    t.integer "recipient"
    t.integer "currentUser"
  end

  create_table "messages", force: :cascade do |t|
    t.integer "user_id"
    t.integer "from"
    t.text    "contents"
    t.integer "timestamp", limit: 8
  end

  create_table "users", id: false, force: :cascade do |t|
    t.integer "id"
    t.text    "name"
    t.text    "profilePicture"
    t.text    "status"
    t.text    "read"
  end

end
