from django.test.runner import DiscoverRunner


class NoDbTestRunner(DiscoverRunner):
    """ A test runner to test without database creation/deletion """

    def run_checks(self, **kwargs):
        pass
