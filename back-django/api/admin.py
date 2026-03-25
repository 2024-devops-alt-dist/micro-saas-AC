from django.contrib import admin

from .models import Category, Level, Propositions, Questions, QuizStats, Users


class PropositionsInline(admin.TabularInline):
    model = Propositions
    extra = 0


@admin.register(Questions)
class QuestionsAdmin(admin.ModelAdmin):
    list_display = ("id", "text_question", "category", "level")
    list_filter = ("category", "level")
    search_fields = ("text_question",)
    inlines = [PropositionsInline]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)


@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)


@admin.register(Users)
class UsersAdmin(admin.ModelAdmin):
    list_display = ("id_user", "pseudo", "email")
    search_fields = ("pseudo", "email")


@admin.register(QuizStats)
class QuizStatsAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "score", "category", "level")
    list_filter = ("category", "level")
